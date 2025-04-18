import { API } from './env';
class ConfigManager {
    constructor() {
        this.state = {
            baseURL: this.getBaseURL(),
            licenseKey: this.getLicenseKey(),
        };
    }
    getBaseURL() {
        // Primero intentamos obtener de las variables de entorno
        if (process.env.NEXT_PUBLIC_MONOLITE_BASE_URL) {
            return process.env.NEXT_PUBLIC_MONOLITE_BASE_URL;
        }
        return `${API.BASE_URL}/${API.VERSION}`;
    }
    getLicenseKey() {
        // Primero intentamos obtener de las variables de entorno
        if (process.env.NEXT_PUBLIC_MONOLITE_LICENSE_KEY) {
            return process.env.NEXT_PUBLIC_MONOLITE_LICENSE_KEY;
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
