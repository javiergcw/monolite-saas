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
            // Buscar el package.json del proyecto que usa el paquete
            const projectPackageJson = require(process.cwd() + '/package.json');
            if (projectPackageJson.monolite && projectPackageJson.monolite.baseURL) {
                return projectPackageJson.monolite.baseURL;
            }
        }
        catch (error) {
            console.error('No se pudo leer la URL base del package.json del proyecto');
        }
        return `${API.BASE_URL}${API.VERSION}`;
    }
    getLicenseKeyFromPackageJson() {
        try {
            // Buscar el package.json del proyecto que usa el paquete
            const projectPackageJson = require(process.cwd() + '/package.json');
            if (projectPackageJson.monolite && projectPackageJson.monolite.licenseKey) {
                return projectPackageJson.monolite.licenseKey;
            }
        }
        catch (error) {
            console.error('No se pudo leer la clave de licencia del package.json del proyecto');
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
