// Constantes de la API
const API = {
  BASE_URL: 'https://api.autoxpert.com.co',
  VERSION: 'v2',
  DEFAULT_LICENSE_KEY: '',
} as const;

// Constantes de endpoints
const ENDPOINTS = {
  BANNERS: {
    LIST: 'banners',
  },
} as const;

// Constantes de headers
const HEADERS = {
  CONTENT_TYPE: 'application/json',
  ACCEPT: 'application/json',
  LICENSE_KEY: 'X-License-Key',
} as const;

export { API, ENDPOINTS, HEADERS }; 