/**
 * @fileoverview Punto de entrada principal para la biblioteca Monolite SaaS
 * @module monolite-saas
 */
// Importaciones de servicios
import { bannersService } from './services/banners';
import { categoriesService } from './services/categories';
import { productsService } from './services/products';
import { axiosService } from './services/axios';
// Importaciones de configuración
import { configManager } from './config';
/**
 * Configuración principal de la aplicación
 * @namespace Config
 */
export { configManager };
/**
 * Servicios principales de la aplicación
 * @namespace Services
 */
export const services = {
    banners: bannersService,
    categories: categoriesService,
    products: productsService,
    axios: axiosService,
};
