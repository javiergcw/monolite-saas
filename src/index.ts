/**
 * @fileoverview Punto de entrada principal para la biblioteca Monolite SaaS
 * @module monolite-saas
 */

// Importaciones de servicios
import { bannersService } from './services/banners';
import { categoriesService } from './services/categories';
import { productsService } from './services/products';
import { axiosService } from './services/axios';

// Importaciones de componentes
import { ErrorNotification } from './components/ErrorNotification';

// Importaciones de tipos
import type { Banner } from './types/banners';
import type { Category, Subcategory } from './types/categories';
import type { 
  Product, 
  ProductFeatures, 
  ProductSearchResult, 
  ProductSearchResponse, 
  ProductFilterBySkuResponse,
  Pagination 
} from './types/products';

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

/**
 * Componentes principales de la aplicación
 * @namespace Components
 */
export { ErrorNotification };

/**
 * Tipos principales de la aplicación
 * @namespace Types
 */
export type { 
  Banner,
  Category, 
  Subcategory,
  Product, 
  ProductFeatures, 
  ProductSearchResult, 
  ProductSearchResponse, 
  ProductFilterBySkuResponse,
  Pagination 
};
