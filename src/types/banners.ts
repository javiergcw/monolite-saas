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

export interface BannerResponse {
  data: Banner[];
  message: string;
} 