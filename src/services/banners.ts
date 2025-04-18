import { axiosService } from './axios';
import { configManager } from '../config';
import { ENDPOINTS, API } from '../env';
import { AxiosError } from 'axios';
import { URLBuilder } from '../utils/urlBuilder';
import { getCache, setCache } from '../utils/cache';
import type { Banner, BannerResponse } from '../types/banners';

/**
 * Servicio para gestionar los banners
 * @class BannersService
 * @example
 * // Obtener todos los banners
 * const banners = await services.banners.getBanners();
 * 
 * // Manejo de errores
 * try {
 *   const banners = await services.banners.getBanners();
 * } catch (error) {
 *   console.error('Error al obtener banners:', error.message);
 * }
 */
export class BannersService {
  private static instance: BannersService;
  private readonly config = configManager.getConfig();
  private readonly CACHE_KEY_PREFIX = 'banners';
  private readonly CACHE_TTL = 60; // 60 segundos

  private constructor() {}

  /**
   * Obtiene la instancia única del servicio de banners (Singleton)
   * @returns {BannersService} Instancia del servicio
   */
  public static getInstance(): BannersService {
    if (!BannersService.instance) {
      BannersService.instance = new BannersService();
    }
    return BannersService.instance;
  }

  /**
   * Obtiene todos los banners disponibles
   * @returns {Promise<Banner[]>} Lista de banners
   * @throws {Error} Si hay un error de red o del servidor
   * @example
   * const banners = await services.banners.getBanners();
   * banners.forEach(banner => {
   *   console.log(banner.title, banner.image_url);
   * });
   */
  public async getBanners(): Promise<Banner[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:list`;
    
    // Intentar obtener del caché primero
    const cachedBanners = getCache<Banner[]>(cacheKey);
    if (cachedBanners) {
      return cachedBanners;
    }

    try {
      const url = URLBuilder.forBanners().withTrailingSlash().build();
      const response = await axiosService.getInstance().get<BannerResponse>(url.toString());
      
      // Guardar en caché solo si la respuesta fue exitosa
      setCache(cacheKey, response.data.data, this.CACHE_TTL, ['banners:list']);
      
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
 * Instancia única del servicio de banners
 * @type {BannersService}
 */
export const bannersService = BannersService.getInstance();
