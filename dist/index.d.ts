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
export declare const services: {
    banners: any;
    categories: any;
    axios: any;
};
/**
 * Tipos principales de la aplicación
 * @namespace Types
 */
export type { Banner } from './services/banners';
export type { Category, Subcategory } from './services/categories';
