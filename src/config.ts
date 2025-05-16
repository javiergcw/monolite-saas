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
      baseURL: this.getBaseURL(),
      licenseKey: this.getLicenseKey(),
    };
  }

  private getBaseURL(): string {
    // Primero intentamos obtener de las variables de entorno
    if (process.env.NEXT_PUBLIC_MONOLITE_BASE_URL) {
      return process.env.NEXT_PUBLIC_MONOLITE_BASE_URL;
    }
    return API.BASE_URL;
  }

  private getLicenseKey(): string {
    // Primero intentamos obtener de las variables de entorno
    if (process.env.NEXT_PUBLIC_MONOLITE_LICENSE_KEY) {
      return process.env.NEXT_PUBLIC_MONOLITE_LICENSE_KEY;
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