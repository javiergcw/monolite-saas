import { jest } from '@jest/globals';
import { BannersService } from '../banners';
import { axiosService } from '../axios';
import { configManager } from '../../config';
import { ENDPOINTS, API } from '../../env';
import type { Banner } from '../../types/banners';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { clearCache, getCache } from '../../utils/cache';

// Mock de axiosService
jest.mock('../axios');
jest.mock('../../config');
jest.mock('../../env', () => ({
  API: {
    BASE_URL: 'https://gateway.makerstech.co',
    VERSION: 'v2',
    DEFAULT_LICENSE_KEY: 'test-license-key'
  },
  ENDPOINTS: {
    BANNERS: {
      LIST: 'banners/'
    }
  }
}));

describe('BannersService', () => {
  let bannersService: BannersService;
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
    bannersService = BannersService.getInstance();
  });

  describe('getBanners', () => {
    const mockSuccessResponse: Banner[] = [
      {
        id: 1,
        title: "Banner Test 1",
        subtitle: "Subtítulo Test 1",
        web_banner_url: "https://example.com/banner1.webp",
        mobile_banner_url: "https://example.com/banner1-mobile.webp",
        popup_banner_url: "https://example.com/banner1-popup.webp",
        redirect_url: "#",
        start_date: "2025-03-22T12:56:47.758Z",
        end_date: "2025-12-31T23:59:59Z",
        active: true,
        zone_code: "test_zone"
      }
    ];

    it('debería obtener la lista de banners correctamente', async () => {
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
      const result = await bannersService.getBanners();
      
      // Verificaciones
      expect(result).toEqual(mockSuccessResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'https://gateway.makerstech.co/banners/'
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
      await expect(bannersService.getBanners()).rejects.toThrow('Error del servidor: 404');
    });

    it('debería manejar error de red correctamente', async () => {
      // Configurar el mock para error de red
      const networkError: AxiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Network Error',
        config: {} as any,
        toJSON: () => ({})
      };

      mockAxiosInstance.get.mockRejectedValueOnce(networkError);

      // Verificar que se lance el error esperado
      await expect(bannersService.getBanners()).rejects.toThrow('Error de red');
    });

    it('debería manejar error de timeout correctamente', async () => {
      // Configurar el mock para error de timeout
      const timeoutError: AxiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        message: 'timeout of 10000ms exceeded',
        code: 'ECONNABORTED',
        config: {} as any,
        toJSON: () => ({})
      };

      mockAxiosInstance.get.mockRejectedValueOnce(timeoutError);

      // Verificar que se lance el error esperado
      await expect(bannersService.getBanners()).rejects.toThrow('Error de red');
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
        await bannersService.getBanners();
        
        // Verificar que se hizo la petición HTTP
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

        // Verificar que los datos están en caché
        const cachedData = getCache<Banner[]>('banners:list');
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
        await bannersService.getBanners();
        
        // Segunda llamada - debería usar el caché
        const result = await bannersService.getBanners();

        // Verificar que solo se hizo una petición HTTP
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
        
        // Verificar que se devolvieron los datos correctos
        expect(result).toEqual(mockSuccessResponse);
      });

      it('debería usar el caché como fallback cuando hay error de red', async () => {
        // Primero guardamos datos en caché
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
        await bannersService.getBanners();

        // Ahora simulamos un error de red
        const networkError: AxiosError = {
          isAxiosError: true,
          name: 'AxiosError',
          message: 'Network Error',
          config: {} as any,
          toJSON: () => ({})
        };
        mockAxiosInstance.get.mockRejectedValueOnce(networkError);

        // La llamada debería devolver los datos del caché
        const result = await bannersService.getBanners();
        expect(result).toEqual(mockSuccessResponse);
      });
    });
  });
});