import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { configManager } from '../config';
import { HEADERS } from '../env';

class AxiosService {
  private static instance: AxiosService;
  public readonly axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }

  public setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { licenseKey } = configManager.getConfig();
        if (licenseKey) {
          config.headers['X-License-Key'] = licenseKey;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }
    return AxiosService.instance;
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const axiosService = AxiosService.getInstance();
export default axiosService.getInstance(); 