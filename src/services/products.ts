import { axiosService } from './axios';
import { configManager } from '../config';
import { ENDPOINTS, API } from '../env';
import { AxiosError } from 'axios';
import { URLBuilder } from '../utils/urlBuilder';
import { getCache, setCache, invalidateCacheByTags, invalidateCacheByTag } from '../utils/cache';
import type {
  Product,
  ProductSearchResponse,
  ProductFilterBySkuResponse,
  ProductVariation,
  ProductVariationsResponse
} from '../types/products';

/**
 * Servicio para gestionar los productos
 * @class ProductsService
 * @example
 * // Obtener todos los productos
 * const products = await services.products.getProducts();
 * 
 * // Buscar productos
 * const searchResults = await services.products.searchProducts('camiseta', 1, 10);
 * 
 * // Filtrar por SKU
 * const filteredProducts = await services.products.filterProductsBySku(['SKU123', 'SKU456']);
 * 
 * // Manejo de errores
 * try {
 *   const products = await services.products.getProducts();
 * } catch (error) {
 *   console.error('Error al obtener productos:', error.message);
 * }
 */
export class ProductsService {
  private static instance: ProductsService;
  private readonly config = configManager.getConfig();
  private readonly CACHE_KEY_PREFIX = 'products';
  private readonly CACHE_TTL = {
    LIST: 300, // 5 minutos para listas
    DETAIL: 600, // 10 minutos para detalles
    SEARCH: 60, // 1 minuto para búsquedas
    FILTER: 300, // 5 minutos para filtros
    VARIATIONS: 300 // 5 minutos para variaciones
  };

  private constructor() {}

  /**
   * Obtiene la instancia única del servicio de productos (Singleton)
   * @returns {ProductsService} Instancia del servicio
   */
  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  /**
   * Obtiene todos los productos disponibles
   * @param {boolean} [includeVariations=true] - Incluir variaciones de productos
   * @param {boolean} [groupAttributes=true] - Agrupar atributos de productos
   * @returns {Promise<Product[]>} Lista de productos
   * @throws {Error} Si hay un error de red o del servidor
   * @example
   * const products = await services.products.getProducts();
   * products.forEach(product => {
   *   console.log(product.name, product.price);
   * });
   */
  public async getProducts(includeVariations = true, groupAttributes = true): Promise<Product[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:list:${includeVariations}:${groupAttributes}`;
    
    // Intentar obtener del caché primero
    const cachedProducts = getCache<Product[]>(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    try {
      const url = URLBuilder.forProducts()
        .withTrailingSlash()
        .build();
      
      url.searchParams.append('include_variations', includeVariations.toString());
      url.searchParams.append('group_attributes', groupAttributes.toString());

      const response = await axiosService.getInstance().get<{ data: Product[]; message: string }>(url.toString());
      
      // Guardar en caché con tags para invalidación
      setCache(cacheKey, response.data.data, this.CACHE_TTL.LIST, ['products:list']);
      
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`Error del servidor: ${axiosError.response.status}`);
      }
      throw new Error('Error de red');
    }
  }

  /**
   * Obtiene un producto específico por su ID
   * @param {number} id - ID del producto a obtener
   * @param {boolean} [includeVariations=true] - Incluir variaciones del producto
   * @param {boolean} [groupAttributes=true] - Agrupar atributos del producto
   * @returns {Promise<Product>} Producto solicitado
   * @throws {Error} Si hay un error de red o del servidor
   * @example
   * const product = await services.products.getProductById(123);
   * console.log(product.name, product.description);
   * if (product.variations) {
   *   product.variations.forEach(variation => {
   *     console.log('-', variation.sku, variation.price);
   *   });
   * }
   */
  public async getProductById(id: number, includeVariations = true, groupAttributes = true): Promise<Product> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:${id}:${includeVariations}:${groupAttributes}`;
    
    // Intentar obtener del caché primero
    const cachedProduct = getCache<Product>(cacheKey);
    if (cachedProduct) {
      return cachedProduct;
    }

    try {
      const url = URLBuilder.forProductDetail(id.toString())
        .withTrailingSlash()
        .build();
      
      url.searchParams.append('include_variations', includeVariations.toString());
      url.searchParams.append('group_attributes', groupAttributes.toString());

      const response = await axiosService.getInstance().get<{ data: Product; message: string }>(url.toString());
      
      // Guardar en caché con tags para invalidación
      setCache(cacheKey, response.data.data, this.CACHE_TTL.DETAIL, [
        'products:detail',
        `products:${id}`
      ]);
      
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`Error del servidor: ${axiosError.response.status}`);
      }
      throw new Error('Error de red');
    }
  }

  /**
   * Busca productos por término de búsqueda
   * @param {string} query - Término de búsqueda
   * @param {number} [page=1] - Número de página
   * @param {number} [limit=10] - Cantidad de resultados por página
   * @returns {Promise<ProductSearchResponse>} Resultados de la búsqueda
   * @throws {Error} Si hay un error de red o del servidor
   * @example
   * const searchResults = await services.products.searchProducts('camiseta', 1, 10);
   * console.log(`Total resultados: ${searchResults.total}`);
   * searchResults.data.forEach(product => {
   *   console.log(product.name, product.price);
   * });
   */
  public async searchProducts(query: string, page = 1, limit = 10): Promise<ProductSearchResponse> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:search:${query}:${page}:${limit}`;
    
    // Intentar obtener del caché primero
    const cachedSearch = getCache<ProductSearchResponse>(cacheKey);
    if (cachedSearch) {
      return cachedSearch;
    }

    try {
      const url = URLBuilder.forProductSearch()
        .withTrailingSlash()
        .build();
      
      url.searchParams.append('q', query);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());

      const response = await axiosService.getInstance().get<ProductSearchResponse>(url.toString());
      
      // Guardar en caché con tags para invalidación
      setCache(cacheKey, response.data, this.CACHE_TTL.SEARCH, [
        'products:search',
        `products:search:${query}`
      ]);
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`Error del servidor: ${axiosError.response.status}`);
      }
      throw new Error('Error de red');
    }
  }

  /**
   * Filtra productos por lista de SKUs
   * @param {string[]} skus - Lista de SKUs a filtrar
   * @param {number} [page=1] - Número de página
   * @param {number} [limit=10] - Cantidad de resultados por página
   * @param {boolean} [includeVariations=true] - Incluir variaciones de productos
   * @returns {Promise<ProductFilterBySkuResponse>} Productos filtrados
   * @throws {Error} Si hay un error de red o del servidor
   * @example
   * const filteredProducts = await services.products.filterProductsBySku(['SKU123', 'SKU456']);
   * filteredProducts.data.forEach(product => {
   *   console.log(product.sku, product.name);
   * });
   */
  public async filterProductsBySku(skus: string[], page = 1, limit = 10, includeVariations = true): Promise<ProductFilterBySkuResponse> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:filter:${skus.join(',')}:${page}:${limit}:${includeVariations}`;
    
    // Intentar obtener del caché primero
    const cachedFilter = getCache<ProductFilterBySkuResponse>(cacheKey);
    if (cachedFilter) {
      return cachedFilter;
    }

    try {
      const url = URLBuilder.forProductFilterBySku()
        .withTrailingSlash()
        .build();

      const response = await axiosService.getInstance().post<ProductFilterBySkuResponse>(url.toString(), {
        skus,
        page,
        limit,
        include_variations: includeVariations
      });
      
      // Guardar en caché con tags para invalidación
      setCache(cacheKey, response.data, this.CACHE_TTL.FILTER, [
        'products:filter',
        `products:filter:${skus.join(',')}`
      ]);
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`Error del servidor: ${axiosError.response.status}`);
      }
      throw new Error('Error de red');
    }
  }

  /**
   * Obtiene las variaciones de un producto específico
   * @param {number} id - ID del producto
   * @returns {Promise<ProductVariation[]>} Lista de variaciones del producto
   * @throws {Error} Si hay un error de red o del servidor
   * @example
   * const variations = await services.products.getProductVariations(123);
   * variations.forEach(variation => {
   *   console.log(variation.sku, variation.price, variation.attributes);
   * });
   */
  public async getProductVariations(id: number): Promise<ProductVariation[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:variations:${id}`;
    
    // Intentar obtener del caché primero
    const cachedVariations = getCache<ProductVariation[]>(cacheKey);
    if (cachedVariations) {
      return cachedVariations;
    }

    try {
      const url = URLBuilder.forProductVariations(id.toString())
        .withTrailingSlash()
        .build();

      const response = await axiosService.getInstance().get<ProductVariationsResponse>(url.toString());
      
      // Guardar en caché con tags para invalidación
      setCache(cacheKey, response.data.data, this.CACHE_TTL.VARIATIONS, [
        'products:variations',
        `products:${id}:variations`
      ]);
      
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`Error del servidor: ${axiosError.response.status}`);
      }
      throw new Error('Error de red');
    }
  }

  // Nuevo método para invalidar caché de un producto específico
  public invalidateProductCache(id: number): void {
    invalidateCacheByTags([
      `products:${id}`,
      `products:${id}:variations`
    ]);
  }

  // Nuevo método para invalidar caché de búsquedas
  public invalidateSearchCache(query: string): void {
    invalidateCacheByTag(`products:search:${query}`);
  }

  // Nuevo método para invalidar caché de filtros
  public invalidateFilterCache(skus: string[]): void {
    invalidateCacheByTag(`products:filter:${skus.join(',')}`);
  }
}

/**
 * Instancia única del servicio de productos
 * @type {ProductsService}
 */
export const productsService = ProductsService.getInstance(); 