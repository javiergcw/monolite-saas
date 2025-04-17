import { axiosService } from './axios';
import { configManager } from '../config';
import { ENDPOINTS, API } from '../env';
import { AxiosError } from 'axios';
import { URLBuilder } from '../utils/urlBuilder';
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
    try {
      const url = URLBuilder.forCategories().withTrailingSlash().build();
      const response = await axiosService.getInstance().get<CategoryResponse>(url.toString());
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
    try {
      const url = URLBuilder.forCategoryDetail(id).withTrailingSlash().build();
      const response = await axiosService.getInstance().get<{ data: Category }>(url.toString());
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