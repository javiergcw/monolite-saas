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
  products: require('./services/products').productsService,
  axios: require('./services/axios').axiosService,
};

/**
 * Tipos principales de la aplicación
 * @namespace Types
 */
export type { Banner } from './services/banners';
export type { Category, Subcategory } from './services/categories';
export type { 
  Product, 
  ProductFeatures, 
  ProductSearchResult, 
  ProductSearchResponse, 
  ProductFilterBySkuResponse,
  Pagination 
} from './services/products';
