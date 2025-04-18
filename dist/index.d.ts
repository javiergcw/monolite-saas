/**
 * @fileoverview Punto de entrada principal para la biblioteca Monolite SaaS
 * @module monolite-saas
 */
import type { Banner } from './types/banners';
import type { Category, Subcategory } from './types/categories';
import type { Product, ProductFeatures, ProductSearchResult, ProductSearchResponse, ProductFilterBySkuResponse, Pagination } from './types/products';
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
export declare const services: {
    banners: import("./services/banners").BannersService;
    categories: import("./services/categories").CategoriesService;
    products: import("./services/products").ProductsService;
    axios: {
        readonly axiosInstance: import("axios").AxiosInstance;
        setupInterceptors(): void;
        getInstance(): import("axios").AxiosInstance;
    };
};
/**
 * Tipos principales de la aplicación
 * @namespace Types
 */
export type { Banner, Category, Subcategory, Product, ProductFeatures, ProductSearchResult, ProductSearchResponse, ProductFilterBySkuResponse, Pagination };
