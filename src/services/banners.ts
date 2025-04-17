import { axiosService } from './axios';
import { configManager } from '../config';
import { ENDPOINTS, API } from '../env';
import { AxiosError } from 'axios';
import { URLBuilder } from '../utils/urlBuilder';

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  web_banner_url: string;
  mobile_banner_url: string;
  popup_banner_url?: string;
  redirect_url: string;
  start_date: string;
  end_date: string;
  active: boolean;
  zone_code: string;
}

interface BannerResponse {
  data: Banner[];
  message: string;
}

export class BannersService {
  private static instance: BannersService;
  private readonly config = configManager.getConfig();

  private constructor() {}

  public static getInstance(): BannersService {
    if (!BannersService.instance) {
      BannersService.instance = new BannersService();
    }
    return BannersService.instance;
  }

  public async getBanners(): Promise<Banner[]> {
    try {
      const url = URLBuilder.forBanners().withTrailingSlash().build();
      const response = await axiosService.getInstance().get<BannerResponse>(url.toString());
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`Error del servidor: ${axiosError.response.status}`);
      }
      throw new Error('Error de red');
    }
  }
}

export const bannersService = BannersService.getInstance();
