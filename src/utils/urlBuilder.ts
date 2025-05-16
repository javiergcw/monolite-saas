import { API, ENDPOINTS } from '../env';

export class URLBuilder {
  private baseUrl: string;
  private path: string;
  private addTrailingSlash: boolean;

  constructor() {
    this.baseUrl = API.BASE_URL;
    this.path = '';
    this.addTrailingSlash = false;
  }

  public setBaseUrl(baseUrl: string): URLBuilder {
    this.baseUrl = baseUrl;
    return this;
  }

  public setPath(path: string): URLBuilder {
    this.path = path;
    return this;
  }

  public withTrailingSlash(): URLBuilder {
    this.addTrailingSlash = true;
    return this;
  }

  public build(): URL {
    const normalizedPath = this.addTrailingSlash && !this.path.endsWith('/') 
      ? `${this.path}/` 
      : this.path;
    const url = new URL(`${this.baseUrl}/${normalizedPath}`);
    return url;
  }

  public static forBanners(): URLBuilder {
    return new URLBuilder().setPath(ENDPOINTS.BANNERS.LIST);
  }

  public static forCategories(): URLBuilder {
    return new URLBuilder().setPath(ENDPOINTS.CATEGORIES.LIST);
  }

  public static forCategoryDetail(id: string): URLBuilder {
    return new URLBuilder().setPath(ENDPOINTS.CATEGORIES.DETAIL.replace(':id', id));
  }

  public static forProducts(): URLBuilder {
    return new URLBuilder().setPath(ENDPOINTS.PRODUCTS.LIST);
  }

  public static forProductDetail(id: string): URLBuilder {
    return new URLBuilder().setPath(ENDPOINTS.PRODUCTS.DETAIL.replace(':id', id));
  }

  public static forProductSearch(): URLBuilder {
    return new URLBuilder().setPath(ENDPOINTS.PRODUCTS.SEARCH);
  }

  public static forProductFilterBySku(): URLBuilder {
    return new URLBuilder().setPath(ENDPOINTS.PRODUCTS.FILTER_BY_SKU);
  }

  public static forProductVariations(id: string): URLBuilder {
    return new URLBuilder().setPath(ENDPOINTS.PRODUCTS.VARIATIONS.replace(':id', id));
  }
} 