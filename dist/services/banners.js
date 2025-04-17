import { axiosService } from './axios';
import { configManager } from '../config';
import { ENDPOINTS } from '../env';
export class BannersService {
    constructor() {
        this.config = configManager.getConfig();
    }
    static getInstance() {
        if (!BannersService.instance) {
            BannersService.instance = new BannersService();
        }
        return BannersService.instance;
    }
    async getBanners() {
        try {
            const response = await axiosService.getInstance().get(`${this.config.baseURL}/v2${ENDPOINTS.BANNERS.LIST}`);
            return response.data.data;
        }
        catch (error) {
            const axiosError = error;
            if (axiosError.response) {
                throw new Error(`Error del servidor: ${axiosError.response.status}`);
            }
            throw new Error('Error de red');
        }
    }
}
export const bannersService = BannersService.getInstance();
