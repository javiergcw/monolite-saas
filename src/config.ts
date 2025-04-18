import { API } from './env';
import * as fs from 'fs';
import * as path from 'path';

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

  private readProjectPackageJson(): any {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        return JSON.parse(packageJsonContent);
      }
    } catch (error) {
      console.error('Error al leer el package.json del proyecto:', error);
    }
    return null;
  }

  private getBaseURLFromPackageJson(): string {
    try {
      const projectPackageJson = this.readProjectPackageJson();
      if (projectPackageJson?.monolite?.baseURL) {
        return projectPackageJson.monolite.baseURL;
      }
    } catch (error) {
      console.error('No se pudo leer la URL base del package.json del proyecto');
    }
    return `${API.BASE_URL}/${API.VERSION}`;
  }

  private getLicenseKeyFromPackageJson(): string {
    try {
      const projectPackageJson = this.readProjectPackageJson();
      if (projectPackageJson?.monolite?.licenseKey) {
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