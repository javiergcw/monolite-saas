import { axiosService } from './axios';
import { configManager } from '../config';
import { ENDPOINTS, API } from '../env';
import { AxiosError } from 'axios';
import { URLBuilder } from '../utils/urlBuilder';
import { getCache, setCache } from '../utils/cache';
import type { Category, Subcategory, CategoryResponse } from '../types/categories';

/**
 * Servicio para gestionar las categorías de productos
 * @class CategoriesService
 * @example
 * // Obtener todas las categorías
 * const categories = await services.categories.getCategories();
 * 
 * // Obtener una categoría específica
 * const category = await services.categories.getCategoryById('123');
 * 
 * // Manejo de errores
 * try {
 *   const categories = await services.categories.getCategories();
 * } catch (error) {
 *   console.error('Error al obtener categorías:', error.message);
 * }
 */
export class CategoriesService {
  private static instance: CategoriesService;
  private readonly config = configManager.getConfig();
  private readonly CACHE_KEY_PREFIX = 'categories';
  private readonly CACHE_TTL = 60; // 60 segundos

  private constructor() {}

  /**
   * Obtiene la instancia única del servicio de categorías (Singleton)
   * @returns {CategoriesService} Instancia del servicio
   */
  public static getInstance(): CategoriesService {
    if (!CategoriesService.instance) {
      CategoriesService.instance = new CategoriesService();
    }
    return CategoriesService.instance;
  }

  /**
   * Obtiene todas las categorías disponibles
   * @returns {Promise<Category[]>} Lista de categorías
   * @throws {Error} Si hay un error de red o del servidor
   * @example
   * const categories = await services.categories.getCategories();
   * categories.forEach(category => {
   *   console.log(category.name, category.subcategories.length);
   * });
   */
  public async getCategories(): Promise<Category[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:list`;
    
    // Intentar obtener del caché primero
    const cachedCategories = getCache<Category[]>(cacheKey);
    if (cachedCategories) {
      return cachedCategories;
    }

    try {
      const url = URLBuilder.forCategories().withTrailingSlash().build();
      const response = await axiosService.getInstance().get<CategoryResponse>(url.toString());
      
      // Guardar en caché solo si la respuesta fue exitosa
      setCache(cacheKey, response.data.data, this.CACHE_TTL, ['categories:list']);
      
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
   * Obtiene una categoría específica por su ID
   * @param {string} id - ID de la categoría a obtener
   * @returns {Promise<Category>} Categoría solicitada
   * @throws {Error} Si hay un error de red o del servidor
   * @example
   * const category = await services.categories.getCategoryById('123');
   * console.log(category.name);
   * category.subcategories.forEach(subcategory => {
   *   console.log('-', subcategory.name);
   * });
   */
  public async getCategoryById(id: string): Promise<Category> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:${id}`;
    
    // Intentar obtener del caché primero
    const cachedCategory = getCache<Category>(cacheKey);
    if (cachedCategory) {
      return cachedCategory;
    }

    try {
      const url = URLBuilder.forCategoryDetail(id).withTrailingSlash().build();
      const response = await axiosService.getInstance().get<{ data: Category }>(url.toString());
      
      // Guardar en caché solo si la respuesta fue exitosa
      setCache(cacheKey, response.data.data, this.CACHE_TTL, [
        'categories:detail',
        `categories:${id}`
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
}

/**
 * Instancia única del servicio de categorías
 * @type {CategoriesService}
 */
export const categoriesService = CategoriesService.getInstance(); 