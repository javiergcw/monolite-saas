import { API } from './env';
class ConfigManager {
    constructor() {
        this.state = {
            baseURL: `${API.BASE_URL}${API.VERSION}`,
            licenseKey: API.DEFAULT_LICENSE_KEY,
        };
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    setBaseURL(url) {
        const versionWithoutSlash = API.VERSION.replace(/\/$/, '');
        this.state.baseURL = url.endsWith(API.VERSION)
            ? url
            : url.endsWith(versionWithoutSlash)
                ? url + '/'
                : url + API.VERSION;
    }
    setLicenseKey(key) {
        this.state.licenseKey = key;
    }
    getConfig() {
        return Object.freeze({ ...this.state });
    }
}
// Exportar una instancia única del ConfigManager
export const configManager = ConfigManager.getInstance();
// Funciones de conveniencia para mantener compatibilidad
export const setBaseURL = (url) => configManager.setBaseURL(url);
export const setLicenseKey = (key) => configManager.setLicenseKey(key);
export const getConfig = () => configManager.getConfig();
