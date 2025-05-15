// Constantes de la API
const API = {
  BASE_URL: 'https://gateway.makerstech.co',
  VERSION: 'v2',
  DEFAULT_LICENSE_KEY: '',
} as const;

// Constantes de endpoints
const ENDPOINTS = {
  BANNERS: {
    LIST: 'banners'
  },
  CATEGORIES: {
    LIST: 'categories',
    DETAIL: 'categories/:id'
  },
  PRODUCTS: {
    LIST: 'products',
    DETAIL: 'products/:id',
    SEARCH: 'products/search',
    FILTER_BY_SKU: 'products/filter/by-sku',
    VARIATIONS: 'products/:id/variations'
  }
} as const;

// Constantes de headers
const HEADERS = {
  CONTENT_TYPE: 'application/json',
  ACCEPT: 'application/json',
  LICENSE_KEY: 'X-License-Key',
} as const;

export { API, ENDPOINTS, HEADERS }; 