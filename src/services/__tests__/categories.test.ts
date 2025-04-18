import { jest } from '@jest/globals';
import { CategoriesService } from '../categories';
import { axiosService } from '../axios';
import { configManager } from '../../config';
import { ENDPOINTS, API } from '../../env';
import type { Category, Subcategory } from '../../types/categories';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { cacheStrategy } from '../cache';
import { CacheKeys } from '../../types/cache.enums';
import { clearCache } from '../../utils/cache';

// Mock de axiosService
const mockGet = jest.fn();
const mockAxiosInstance = {
  get: mockGet,
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
} as unknown as AxiosInstance;

// Mock de axiosService
jest.mock('../axios', () => ({
  axiosService: {
    getInstance: jest.fn(() => mockAxiosInstance)
  }
}));

// Mock de configManager
jest.mock('../../config', () => {
  return {
    configManager: {
      getConfig: jest.fn().mockReturnValue({
        baseURL: 'https://api.autoxpert.com.co',
        licenseKey: 'AAAAAAAAAAAAAAAAEvvVEw0tkqMjxmm1Xn23GKuaLjtJqcJyqayhmgFgSA=='
      }),
      setBaseURL: jest.fn(),
      setLicenseKey: jest.fn()
    }
  };
});

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    // Limpiar el caché
    clearCache();

    // Crear un mock del AxiosInstance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      request: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    } as unknown as jest.Mocked<AxiosInstance>;

    // Mock de axiosService
    jest.spyOn(axiosService, 'getInstance').mockReturnValue(mockAxiosInstance);

    // Mock de configManager
    jest.spyOn(configManager, 'getConfig').mockReturnValue({
      baseURL: API.BASE_URL,
      licenseKey: 'test-license-key'
    });

    // Inicializar el servicio
    categoriesService = CategoriesService.getInstance();
  });

  describe('getCategories', () => {
    const mockSuccessResponse: Category[] = [
      {
        id: "2e5d5a09-9c79-49b7-b4e3-2e834a421f92",
        name: "Camiones ligeros",
        description: "Camiones con capacidad de carga menor a 3 toneladas, ideales para reparto urbano y cargas ligeras.",
        image_url: "",
        slug: "camiones-ligeros-menores-3-toneladas",
        status: true,
        priority: 10,
        subcategories: []
      }
    ];

    it('debería obtener la lista de categorías correctamente', async () => {
      // Configurar el mock de la respuesta exitosa
      const mockResponse: AxiosResponse = {
        data: {
          data: mockSuccessResponse,
          message: "Consulta realizada correctamente"
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      // Ejecutar el método y verificar el resultado
      const result = await categoriesService.getCategories();
      
      // Verificaciones
      expect(result).toEqual(mockSuccessResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'https://api.autoxpert.com.co/v2/categories/'
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });

    it('debería manejar error 404 correctamente', async () => {
      // Configurar el mock para error 404
      const error: AxiosError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Recurso no encontrado' },
          headers: {},
          config: {} as any
        },
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed with status code 404',
        config: {} as any,
        toJSON: () => ({})
      };

      mockAxiosInstance.get.mockRejectedValueOnce(error);

      // Verificar que se lance el error esperado
      await expect(categoriesService.getCategories()).rejects.toThrow('Error del servidor: 404');
    });

    describe('Caché', () => {
      it('debería guardar los datos en caché después de una petición exitosa', async () => {
        const mockResponse: AxiosResponse = {
          data: {
            data: mockSuccessResponse,
            message: "Consulta realizada correctamente"
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

        // Primera llamada - debería hacer la petición HTTP
        await categoriesService.getCategories();
        
        // Verificar que se hizo la petición HTTP
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

        // Verificar que los datos están en caché
        const cachedData = cacheStrategy.shared.get<Category[]>(CacheKeys.CATEGORIES_LIST);
        expect(cachedData).toEqual(mockSuccessResponse);
      });

      it('debería usar el caché en lugar de hacer una nueva petición HTTP', async () => {
        const mockResponse: AxiosResponse = {
          data: {
            data: mockSuccessResponse,
            message: "Consulta realizada correctamente"
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

        // Primera llamada - hace la petición HTTP y guarda en caché
        await categoriesService.getCategories();
        
        // Segunda llamada - debería usar el caché
        const result = await categoriesService.getCategories();

        // Verificar que solo se hizo una petición HTTP
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
        
        // Verificar que se devolvieron los datos correctos
        expect(result).toEqual(mockSuccessResponse);
      });
    });
  });

  describe('getCategoryById', () => {
    const mockCategory: Category = {
      id: "2e5d5a09-9c79-49b7-b4e3-2e834a421f92",
      name: "Camiones ligeros",
      description: "Camiones con capacidad de carga menor a 3 toneladas, ideales para reparto urbano y cargas ligeras.",
      image_url: "",
      slug: "camiones-ligeros-menores-3-toneladas",
      status: true,
      priority: 10,
      subcategories: [
        {
          id: "287d38fa-c124-4676-901c-c49c549860fa",
          name: "2.9 t",
          description: "Camión ligero de 2.9 toneladas, perfecto para logística de corto alcance.",
          image_url: "",
          slug: "2-9-t",
          status: true,
          priority: 5,
          category_id: "2e5d5a09-9c79-49b7-b4e3-2e834a421f92"
        }
      ]
    };

    it('debería obtener una categoría por ID correctamente', async () => {
      // Configurar el mock de la respuesta exitosa
      const mockResponse: AxiosResponse = {
        data: {
          data: mockCategory
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      // Ejecutar el método y verificar el resultado
      const result = await categoriesService.getCategoryById(mockCategory.id);
      
      // Verificaciones
      expect(result).toEqual(mockCategory);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `https://api.autoxpert.com.co/v2/categories/${mockCategory.id}/`
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });

    it('debería manejar error 404 al obtener una categoría por ID', async () => {
      // Configurar el mock para error 404
      const error: AxiosError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Recurso no encontrado' },
          headers: {},
          config: {} as any
        },
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed with status code 404',
        config: {} as any,
        toJSON: () => ({})
      };

      mockAxiosInstance.get.mockRejectedValueOnce(error);

      // Verificar que se lance el error esperado
      await expect(categoriesService.getCategoryById('non-existent-id')).rejects.toThrow('Error del servidor: 404');
    });

    describe('Caché', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        clearCache();
      });

      it('debería guardar los datos en caché después de una petición exitosa', async () => {
        // Configurar el mock de la respuesta exitosa
        mockAxiosInstance.get.mockResolvedValueOnce({
          data: {
            data: mockCategory,
            message: "Consulta realizada correctamente"
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        });

        await categoriesService.getCategoryById(mockCategory.id);

        // Verificar que los datos están en caché
        const cachedData = cacheStrategy.shared.get<Category>(`${CacheKeys.CATEGORIES_DETAIL}:${mockCategory.id}`);
        expect(cachedData).toEqual(mockCategory);
      });

      it('debería usar el caché en lugar de hacer una nueva petición HTTP', async () => {
        // Simular que los datos ya están en caché
        cacheStrategy.shared.set(`${CacheKeys.CATEGORIES_DETAIL}:${mockCategory.id}`, mockCategory, {
          ttl: 60,
          tags: [CacheKeys.CATEGORIES_DETAIL]
        });

        const result = await categoriesService.getCategoryById(mockCategory.id);

        expect(result).toEqual(mockCategory);
        expect(mockAxiosInstance.get).not.toHaveBeenCalled();
      });
    });
  });
}); 