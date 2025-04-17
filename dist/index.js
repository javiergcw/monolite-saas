/**
 * @fileoverview Punto de entrada principal para la biblioteca Monolite SaaS
 * @module monolite-saas
 */
/**
 * Configuración principal de la aplicación
 * @namespace Config
 */
export { configManager } from './config';
/**
 * Servicios principales de la aplicación
 * @namespace Services
 */
export const services = {
    banners: require('./services/banners').bannersService,
    categories: require('./services/categories').categoriesService,
    axios: require('./services/axios').axiosService,
};
