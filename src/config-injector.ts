import { API } from './env';

export const injectConfig = () => {
  if (typeof window !== 'undefined') {
    (window as any).__MONOLITE_CONFIG__ = {
      baseURL: process.env.NEXT_PUBLIC_MONOLITE_BASE_URL || `${API.BASE_URL}/${API.VERSION}`,
      licenseKey: process.env.NEXT_PUBLIC_MONOLITE_LICENSE_KEY || API.DEFAULT_LICENSE_KEY,
    };
  }
}; 