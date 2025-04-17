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

export interface CategoryResponse {
  data: Category[];
  message: string;
} 