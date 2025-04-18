import { API } from './env';
import { notificationService } from './services/notification';
class ConfigManager {
    constructor() {
        this.state = {
            baseURL: this.getBaseURLFromPackageJson(),
            licenseKey: this.getLicenseKeyFromPackageJson(),
        };
    }
    getBaseURLFromPackageJson() {
        try {
            const packageJson = require('../../package.json');
            if (packageJson.monolite && packageJson.monolite.baseURL) {
                return packageJson.monolite.baseURL;
            }
        }
        catch (error) {
            notificationService.showError('No se pudo leer la URL base del package.json');
        }
        return `${API.BASE_URL}${API.VERSION}`;
    }
    getLicenseKeyFromPackageJson() {
        try {
            const packageJson = require('../../package.json');
            if (packageJson.monolite && packageJson.monolite.licenseKey) {
                return packageJson.monolite.licenseKey;
            }
        }
        catch (error) {
            notificationService.showError('No se pudo leer la clave de licencia del package.json');
        }
        return API.DEFAULT_LICENSE_KEY;
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    setBaseURL(url) {
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
    setLicenseKey(key) {
        if (!key) {
            notificationService.showError('La clave de licencia no puede estar vacía');
            return;
        }
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
