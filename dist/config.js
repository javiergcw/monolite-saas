import { API } from './env';
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
            console.error('No se pudo leer la URL base del package.json');
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
            console.error('No se pudo leer la clave de licencia del package.json');
        }
        return API.DEFAULT_LICENSE_KEY;
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    getConfig() {
        return Object.freeze({ ...this.state });
    }
}
// Exportar una instancia única del ConfigManager
export const configManager = ConfigManager.getInstance();
// Función de conveniencia para mantener compatibilidad
export const getConfig = () => configManager.getConfig();
