import { API } from './env';

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
      // Buscar el package.json del proyecto que usa el paquete
      const projectPackageJson = require(process.cwd() + '/package.json');
      if (projectPackageJson.monolite && projectPackageJson.monolite.baseURL) {
        return projectPackageJson.monolite.baseURL;
      }
    } catch (error) {
      console.error('No se pudo leer la URL base del package.json del proyecto');
    }
    return `${API.BASE_URL}${API.VERSION}`;
  }

  private getLicenseKeyFromPackageJson(): string {
    try {
      // Buscar el package.json del proyecto que usa el paquete
      const projectPackageJson = require(process.cwd() + '/package.json');
      if (projectPackageJson.monolite && projectPackageJson.monolite.licenseKey) {
        return projectPackageJson.monolite.licenseKey;
      }
    } catch (error) {
      console.error('No se pudo leer la clave de licencia del package.json del proyecto');
    }
    return API.DEFAULT_LICENSE_KEY;
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): Readonly<ConfigState> {
    return Object.freeze({ ...this.state });
  }
}

// Exportar una instancia única del ConfigManager
export const configManager = ConfigManager.getInstance();

// Función de conveniencia para mantener compatibilidad
export const getConfig = () => configManager.getConfig(); 