import { API, ENDPOINTS } from '../env';

export class URLBuilder {
  private baseUrl: string;
  private version: string;
  private path: string;

  constructor() {
    this.baseUrl = API.BASE_URL;
    this.version = API.VERSION;
    this.path = '';
  }

  public setBaseUrl(baseUrl: string): URLBuilder {
    this.baseUrl = baseUrl;
    return this;
  }

  public setVersion(version: string): URLBuilder {
    this.version = version;
    return this;
  }

  public setPath(path: string): URLBuilder {
    this.path = path;
    return this;
  }

  public build(): URL {
    const url = new URL(`${this.baseUrl}/${this.version}/${this.path}`);
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
} 