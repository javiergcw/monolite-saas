import type { Banner } from '../types/banners';
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
export declare class BannersService {
    private static instance;
    private readonly config;
    private readonly CACHE_TTL;
    private constructor();
    /**
     * Obtiene la instancia única del servicio de banners (Singleton)
     * @returns {BannersService} Instancia del servicio
     */
    static getInstance(): BannersService;
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
    getBanners(): Promise<Banner[]>;
}
/**
 * Instancia única del servicio de banners
 * @type {BannersService}
 */
export declare const bannersService: BannersService;
