import { axiosService } from './axios';
import { configManager } from '../config';
import { ENDPOINTS, API } from '../env';
import { AxiosError } from 'axios';
import { URLBuilder } from '../utils/urlBuilder';
import { cacheStrategy } from './cache';
import { CacheKeys } from '../types/cache.enums';
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
  private readonly CACHE_TTL = 300; // 5 minutos

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
    // Intentar obtener del caché compartido primero
    const cachedBanners = cacheStrategy.shared.get<Banner[]>(CacheKeys.BANNERS_LIST);
    if (cachedBanners) {
      return cachedBanners;
    }

    try {
      const url = URLBuilder.forBanners().withTrailingSlash().build();
      const response = await axiosService.getInstance().get<BannerResponse>(url.toString());
      
      // Guardar en caché compartido
      cacheStrategy.shared.set(CacheKeys.BANNERS_LIST, response.data.data, {
        ttl: this.CACHE_TTL,
        tags: [CacheKeys.BANNERS_LIST]
      });
      
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
