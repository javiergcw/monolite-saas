import { axiosService } from './axios';
import { configManager } from '../config';
import { ENDPOINTS, API } from '../env';
import { AxiosError } from 'axios';

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  status: boolean;
  priority: number;
  category_id: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  status: boolean;
  priority: number;
  subcategories: Subcategory[];
}

interface CategoryResponse {
  data: Category[];
  message: string;
}

export class CategoriesService {
  private static instance: CategoriesService;
  private readonly config = configManager.getConfig();

  private constructor() {}

  public static getInstance(): CategoriesService {
    if (!CategoriesService.instance) {
      CategoriesService.instance = new CategoriesService();
    }
    return CategoriesService.instance;
  }

  public async getCategories(): Promise<Category[]> {
    try {
      const url = new URL(`${API.BASE_URL}/${API.VERSION}/${ENDPOINTS.CATEGORIES.LIST}`);
      const response = await axiosService.getInstance().get<CategoryResponse>(url.toString());
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`Error del servidor: ${axiosError.response.status}`);
      }
      throw new Error('Error de red');
    }
  }

  public async getCategoryById(id: string): Promise<Category> {
    try {
      const url = new URL(`${API.BASE_URL}/${API.VERSION}/${ENDPOINTS.CATEGORIES.DETAIL.replace(':id', id)}`);
      const response = await axiosService.getInstance().get<{ data: Category }>(url.toString());
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

export const categoriesService = CategoriesService.getInstance(); 