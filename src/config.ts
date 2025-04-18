import React from 'react';
import ReactDOM from 'react-dom';
import { API } from './env';
import { notificationService } from './services/notification';

interface ConfigState {
  baseURL: string;
  licenseKey: string;
}

class ConfigManager {
  private static instance: ConfigManager;
  private state: ConfigState;

  private constructor() {
    this.state = {
      baseURL: this.getBaseURLFromPackageJson(),
      licenseKey: this.getLicenseKeyFromPackageJson(),
    };
  }

  private getBaseURLFromPackageJson(): string {
    try {
      const packageJson = require('../../package.json');
      if (packageJson.monolite && packageJson.monolite.baseURL) {
        return packageJson.monolite.baseURL;
      }
    } catch (error) {
      notificationService.showError('No se pudo leer la URL base del package.json');
    }
    return `${API.BASE_URL}${API.VERSION}`;
  }

  private getLicenseKeyFromPackageJson(): string {
    try {
      const packageJson = require('../../package.json');
      if (packageJson.monolite && packageJson.monolite.licenseKey) {
        return packageJson.monolite.licenseKey;
      }
    } catch (error) {
      notificationService.showError('No se pudo leer la clave de licencia del package.json');
    }
    return API.DEFAULT_LICENSE_KEY;
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public setBaseURL(url: string): void {
    if (!url) {
      notificationService.showError('La URL base no puede estar vacía');
      return;
    }

    const versionWithoutSlash = API.VERSION.replace(/\/$/, '');
    this.state.baseURL = url.endsWith(API.VERSION) 
      ? url 
      : url.endsWith(versionWithoutSlash) 
        ? url + '/' 
        : url + API.VERSION;
  }

  public setLicenseKey(key: string): void {
    if (!key) {
      notificationService.showError('La clave de licencia no puede estar vacía');
      return;
    }
    this.state.licenseKey = key;
  }

  public getConfig(): Readonly<ConfigState> {
    return Object.freeze({ ...this.state });
  }
}

// Exportar una instancia única del ConfigManager
export const configManager = ConfigManager.getInstance();

// Funciones de conveniencia para mantener compatibilidad
export const setBaseURL = (url: string) => configManager.setBaseURL(url);
export const setLicenseKey = (key: string) => configManager.setLicenseKey(key);
export const getConfig = () => configManager.getConfig(); 