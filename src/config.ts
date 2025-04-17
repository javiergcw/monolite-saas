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
      baseURL: `${API.BASE_URL}${API.VERSION}`,
      licenseKey: API.DEFAULT_LICENSE_KEY,
    };
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public setBaseURL(url: string): void {
    const versionWithoutSlash = API.VERSION.replace(/\/$/, '');
    this.state.baseURL = url.endsWith(API.VERSION) 
      ? url 
      : url.endsWith(versionWithoutSlash) 
        ? url + '/' 
        : url + API.VERSION;
  }

  public setLicenseKey(key: string): void {
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
