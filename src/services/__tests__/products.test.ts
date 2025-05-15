import { jest } from '@jest/globals';
import { ProductsService } from '../products';
import { axiosService } from '../axios';
import { configManager } from '../../config';
import { ENDPOINTS, API } from '../../env';
import type { 
  Product, 
  ProductSearchResult, 
  ProductSearchResponse, 
  ProductFilterBySkuResponse, 
  ProductVariation,
  ProductVariationsResponse
} from '../../types/products';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { clearCache, getCache } from '../../utils/cache';
import { URLBuilder } from '../../utils/urlBuilder';
import { cacheStrategy } from '../cache';
import { CacheKeys } from '../../types/cache.enums';

// Mock de axiosService
const mockGet = jest.fn<() => Promise<AxiosResponse<ProductVariationsResponse>>>();
const mockPost = jest.fn<() => Promise<AxiosResponse<ProductFilterBySkuResponse>>>();
const mockAxiosInstance = {
  get: mockGet,
  post: mockPost
};

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
        baseURL: 'https://gateway.makerstech.co',
        licenseKey: 'AAAAAAAAAAAAAAAAEvvVEw0tkqMjxmm1Xn23GKuaLjtJqcJyqayhmgFgSA=='
      }),
      setBaseURL: jest.fn(),
      setLicenseKey: jest.fn()
    }
  };
});

describe('ProductsService', () => {
  let productsService: ProductsService;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    // Limpiar el caché
    clearCache();

    // Crear un mock del AxiosInstance
    mockAxiosInstance = {
      get: mockGet,
      post: mockPost
    } as unknown as jest.Mocked<AxiosInstance>;

    // Mock de axiosService
    jest.spyOn(axiosService, 'getInstance').mockReturnValue(mockAxiosInstance);

    // Mock de configManager
    jest.spyOn(configManager, 'getConfig').mockReturnValue({
      baseURL: API.BASE_URL,
      licenseKey: 'test-license-key'
    });

    // Inicializar el servicio
    productsService = ProductsService.getInstance();
  });

  describe('getProducts', () => {
    const mockSuccessResponse: Product[] = [
      {
        id: 26,
        name: "WKR 3.7 Tiger",
        sku: "WKR-3-7-TIGER",
        price: 105990000,
        image_url: "https://s3.autoxpert.com.co/public/space_20250417151116/file_20250417165506.png",
        active: false,
        public: false,
        has_stock: false,
        stock: 0,
        category_id: "f1825eea-1946-4aa6-b680-2eb10a5597b5",
        category_name: "Camiones medianos",
        subcategory_id: "77176b7c-e91d-45a5-ae9f-3db76ee25d28",
        subcategory_name: "3.7 t"
      }
    ];

    it('debería obtener la lista de productos correctamente', async () => {
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
      const result = await productsService.getProducts();
      
      // Verificaciones
      expect(result).toEqual(mockSuccessResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'https://gateway.makerstech.co/products/?include_variations=true&group_attributes=true'
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
      await expect(productsService.getProducts()).rejects.toThrow('Error del servidor: 404');
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
        await productsService.getProducts();
        
        // Verificar que se hizo la petición HTTP
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

        // Verificar que los datos están en caché
        const cachedData = getCache('products:list:true:true');
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
        await productsService.getProducts();
        
        // Segunda llamada - debería usar el caché
        const result = await productsService.getProducts();

        // Verificar que solo se hizo una petición HTTP
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
        
        // Verificar que se devolvieron los datos correctos
        expect(result).toEqual(mockSuccessResponse);
      });
    });
  });

  describe('getProductById', () => {
    const mockProduct: Product = {
      id: 26,
      name: "WKR 3.7 Tiger",
      description: "Camión mediano de 3.7 t, versátil y económico para carga media en rutas variadas.",
      sku: "WKR-3-7-TIGER",
      price: 105990000,
      image_url: "https://s3.autoxpert.com.co/public/space_20250417151116/file_20250417165506.png",
      active: false,
      public: false,
      has_stock: false,
      stock: 0,
      category_id: "f1825eea-1946-4aa6-b680-2eb10a5597b5",
      category_name: "Camiones medianos",
      subcategory_id: "77176b7c-e91d-45a5-ae9f-3db76ee25d28",
      subcategory_name: "3.7 t",
      features: {
        motor: "FAW CA4DB1A13E68",
        chasis: {
          direccion: "Hidráulica",
          suspension_trasero: "Ballestas semielípticas y muelle auxiliar",
          barra_estabilizadora: "Delantera y trasera",
          suspension_delantero: "Ballestas semielípticas",
          amortiguadores_traseros: "Hidráulico de doble acción, telescópicos",
          amortiguadores_delanteros: "Hidráulico de doble acción, telescópicos"
        },
        frenos: ["Aire", "Emergencia"],
        tanque: {
          material: "Plástico",
          capacidad_L: "110"
        },
        confort: [
          "Aire acondicionado",
          "Bloqueo central",
          "MP5",
          "Cierre central",
          "Volante multinacional",
          "Kit de herramienta",
          "Llanta de repuesto",
          "Luz antiniebla delantera y trasera",
          "Elevavidrios eléctrico",
          "Espejos retrovisores: 5"
        ],
        cilindros: "4",
        desempeno: {
          cabina: "Sencilla",
          numero_ruedas: "6",
          radio_giro_mm: "6053",
          dimensiones_mm: "5885×1895×2319",
          peso_chasis_kg: "2220",
          distancia_ejes_mm: "3300",
          capacidad_carga_kg: "3780",
          peso_total_neto_kg: "6000",
          capacidad_eje_trasero_kg: "4000",
          capacidad_eje_delantero_kg: "2000",
          arranque_en_pendiente_percent: "27"
        },
        inyeccion: "Common Rail",
        neumatico: "205/75R17.5",
        torque_nm: "320 Nm",
        combustible: "Diésel",
        potencia_hp: "130 HP",
        transmision: {
          tipo: "Manual",
          modelo: "WLY 5G32C 5MT",
          marchas: "5+R",
          traccion: "4x2",
          relacion_final: "5.571",
          relacion_reversa: "4.505"
        },
        alimentacion: "Turbo cargado",
        norma_ambiental: "EURO VI",
        sistema_electrico: {
          voltaje_V: "24",
          numero_baterias: "2"
        },
        desplazamiento_cm3: "2210"
      }
    };

    it('debería obtener un producto por ID correctamente', async () => {
      // Configurar el mock de la respuesta exitosa
      const mockResponse: AxiosResponse = {
        data: {
          data: mockProduct,
          message: "Consulta realizada correctamente"
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      // Ejecutar el método y verificar el resultado
      const result = await productsService.getProductById(26);
      
      // Verificaciones
      expect(result).toEqual(mockProduct);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'https://gateway.makerstech.co/products/26?include_variations=true&group_attributes=true'
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });

    it('debería manejar error 404 al obtener un producto por ID', async () => {
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
      await expect(productsService.getProductById(999)).rejects.toThrow('Error del servidor: 404');
    });

    describe('Caché', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        cacheStrategy.shared.clear();
      });

      it('debería guardar los datos en caché después de una petición exitosa', async () => {
        const mockResponse: AxiosResponse = {
          data: {
            data: mockProduct,
            message: "Consulta realizada correctamente"
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

        await productsService.getProductById(mockProduct.id, true, true);

        // Verificar que los datos están en caché
        const cachedData = cacheStrategy.shared.get<Product>(`${CacheKeys.PRODUCTS_DETAIL}:${mockProduct.id}:true:true`);
        expect(cachedData).toEqual(mockProduct);
      });

      it('debería usar el caché en lugar de hacer una nueva petición HTTP', async () => {
        // Simular que los datos ya están en caché
        cacheStrategy.shared.set(`${CacheKeys.PRODUCTS_DETAIL}:${mockProduct.id}:true:true`, mockProduct, {
          ttl: 60,
          tags: [CacheKeys.PRODUCTS_DETAIL]
        });

        // Limpiar el mock antes de la llamada
        mockAxiosInstance.get.mockClear();

        const result = await productsService.getProductById(mockProduct.id, true, true);

        expect(result).toEqual(mockProduct);
        expect(mockAxiosInstance.get).not.toHaveBeenCalled();
      });
    });
  });

  describe('searchProducts', () => {
    const mockSearchResults: ProductSearchResult[] = [
      {
        id: 26,
        name: "WKR 3.7 Tiger",
        sku: "WKR-3-7-TIGER",
        category_name: "Camiones medianos",
        subcategory_name: "3.7 t",
        image_url: "https://s3.autoxpert.com.co/public/space_20250417151116/file_20250417165506.png"
      }
    ];

    const mockSearchResponse: ProductSearchResponse = {
      data: {
        pagination: {
          limit: 4,
          page: 1,
          total: 1
        },
        results: mockSearchResults
      },
      message: "Búsqueda realizada correctamente"
    };

    it('debería buscar productos correctamente', async () => {
      // Configurar el mock de la respuesta exitosa
      const mockResponse: AxiosResponse = {
        data: mockSearchResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      // Ejecutar el método y verificar el resultado
      const result = await productsService.searchProducts('cami', 1, 4);
      
      // Verificaciones
      expect(result).toEqual(mockSearchResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'https://gateway.makerstech.co/products/search/?q=cami&page=1&limit=4'
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });

    describe('Caché', () => {
      it('debería guardar los datos en caché después de una petición exitosa', async () => {
        const mockResponse: AxiosResponse = {
          data: mockSearchResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

        // Primera llamada - debería hacer la petición HTTP
        await productsService.searchProducts('cami', 1, 4);
        
        // Verificar que se hizo la petición HTTP
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

        // Verificar que los datos están en caché
        const cachedData = getCache('products:search:cami:1:4');
        expect(cachedData).toEqual(mockSearchResponse);
      });

      it('debería usar el caché en lugar de hacer una nueva petición HTTP', async () => {
        const mockResponse: AxiosResponse = {
          data: mockSearchResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

        // Primera llamada - hace la petición HTTP y guarda en caché
        await productsService.searchProducts('cami', 1, 4);
        
        // Segunda llamada - debería usar el caché
        const result = await productsService.searchProducts('cami', 1, 4);

        // Verificar que solo se hizo una petición HTTP
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
        
        // Verificar que se devolvieron los datos correctos
        expect(result).toEqual(mockSearchResponse);
      });
    });
  });

  describe('filterProductsBySku', () => {
    const mockProducts: Product[] = [
      {
        id: 26,
        name: "WKR 3.7 Tiger",
        sku: "WKR-3-7-TIGER",
        price: 105990000,
        image_url: "https://s3.autoxpert.com.co/public/space_20250417151116/file_20250417165506.png",
        active: false,
        public: false,
        has_stock: false,
        stock: 0,
        category_id: "f1825eea-1946-4aa6-b680-2eb10a5597b5",
        category_name: "Camiones medianos",
        subcategory_id: "77176b7c-e91d-45a5-ae9f-3db76ee25d28",
        subcategory_name: "3.7 t"
      }
    ];

    const mockFilterResponse: ProductFilterBySkuResponse = {
      data: {
        pagination: {
          limit: 5,
          page: 1,
          total: 1
        },
        products: mockProducts
      },
      message: "Consulta realizada correctamente"
    };

    it('debería filtrar productos por SKU correctamente', async () => {
      // Configurar el mock de la respuesta exitosa
      const mockResponse: AxiosResponse = {
        data: mockFilterResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      // Ejecutar el método y verificar el resultado
      const result = await productsService.filterProductsBySku(['WKR-3-7-TIGER', 'JKRD-001']);
      
      // Verificaciones
      expect(result).toEqual(mockFilterResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'https://gateway.makerstech.co/products/filter/by-sku/',
        {
          skus: ['WKR-3-7-TIGER', 'JKRD-001'],
          page: 1,
          limit: 10,
          include_variations: true
        }
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    });

    describe('Caché', () => {
      it('debería guardar los datos en caché después de una petición exitosa', async () => {
        const mockResponse: AxiosResponse = {
          data: mockFilterResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

        // Primera llamada - debería hacer la petición HTTP
        await productsService.filterProductsBySku(['WKR-3-7-TIGER', 'JKRD-001']);
        
        // Verificar que se hizo la petición HTTP
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);

        // Verificar que los datos están en caché
        const cachedData = getCache('products:filter:WKR-3-7-TIGER,JKRD-001:1:10:true');
        expect(cachedData).toEqual(mockFilterResponse);
      });

      it('debería usar el caché en lugar de hacer una nueva petición HTTP', async () => {
        const mockResponse: AxiosResponse = {
          data: mockFilterResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

        // Primera llamada - hace la petición HTTP y guarda en caché
        await productsService.filterProductsBySku(['WKR-3-7-TIGER', 'JKRD-001']);
        
        // Segunda llamada - debería usar el caché
        const result = await productsService.filterProductsBySku(['WKR-3-7-TIGER', 'JKRD-001']);

        // Verificar que solo se hizo una petición HTTP
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
        
        // Verificar que se devolvieron los datos correctos
        expect(result).toEqual(mockFilterResponse);
      });
    });
  });

  describe('getProductVariations', () => {
    const mockVariations: ProductVariation[] = [
      {
        id: 7,
        product_id: 2,
        sku: '123123',
        price: 0,
        stock: 1,
        image_url: 'https://s3.autoxpert.com.co/public/space_20250317074754/file_20250317195846.png'
      }
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      cacheStrategy.shared.invalidate(['products:variations']);
    });

    it('debería obtener las variaciones de un producto', async () => {
      const mockResponse: AxiosResponse<ProductVariationsResponse> = {
        data: {
          data: mockVariations,
          message: 'Variaciones obtenidas correctamente'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      mockGet.mockResolvedValue(mockResponse);

      const variations = await productsService.getProductVariations(2);
      expect(variations).toEqual(mockVariations);
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('/products/2/variations/')
      );
    });

    describe('Caché', () => {
      it('debería guardar los datos en caché después de una petición exitosa', async () => {
        const mockResponse: AxiosResponse<ProductVariationsResponse> = {
          data: {
            data: mockVariations,
            message: 'Variaciones obtenidas correctamente'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockGet.mockResolvedValue(mockResponse);

        await productsService.getProductVariations(2);

        // Verificar que los datos están en caché
        const cachedData = cacheStrategy.shared.get<ProductVariation[]>('products:2:variations');
        expect(cachedData).toEqual(mockVariations);
      });

      it('debería usar el caché en lugar de hacer una nueva petición HTTP', async () => {
        const mockResponse: AxiosResponse<ProductVariationsResponse> = {
          data: {
            data: mockVariations,
            message: 'Variaciones obtenidas correctamente'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };

        mockGet.mockResolvedValue(mockResponse);

        // Primera llamada - guarda en caché
        await productsService.getProductVariations(2);

        // Segunda llamada - debería usar el caché
        const variations = await productsService.getProductVariations(2);

        expect(variations).toEqual(mockVariations);
        expect(mockGet).toHaveBeenCalledTimes(1);
      });
    });

    it('debería manejar error 404 al obtener variaciones de un producto', async () => {
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
      } as AxiosError;

      mockGet.mockRejectedValue(error);

      await expect(productsService.getProductVariations(999)).rejects.toThrow('Error del servidor: 404');
    });
  });
}); 