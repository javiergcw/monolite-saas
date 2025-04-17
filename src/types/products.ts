export interface ProductFeatures {
  motor?: string;
  chasis?: {
    direccion?: string;
    suspension_trasero?: string;
    barra_estabilizadora?: string;
    suspension_delantero?: string;
    amortiguadores_traseros?: string;
    amortiguadores_delanteros?: string;
  };
  frenos?: string[];
  tanque?: {
    material?: string;
    capacidad_L?: string;
  };
  confort?: string[];
  cilindros?: string;
  desempeno?: {
    cabina?: string;
    numero_ruedas?: string;
    radio_giro_mm?: string;
    dimensiones_mm?: string;
    peso_chasis_kg?: string;
    distancia_ejes_mm?: string;
    capacidad_carga_kg?: string;
    peso_total_neto_kg?: string;
    capacidad_eje_trasero_kg?: string;
    capacidad_eje_delantero_kg?: string;
    arranque_en_pendiente_percent?: string;
  };
  inyeccion?: string;
  neumatico?: string;
  torque_nm?: string;
  combustible?: string;
  potencia_hp?: string;
  transmision?: {
    tipo?: string;
    modelo?: string;
    marchas?: string;
    traccion?: string;
    relacion_final?: string;
    relacion_reversa?: string;
  };
  alimentacion?: string;
  norma_ambiental?: string;
  sistema_electrico?: {
    voltaje_V?: string;
    numero_baterias?: string;
  };
  desplazamiento_cm3?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  image_url: string;
  active: boolean;
  public: boolean;
  has_stock: boolean;
  stock: number;
  category_id: string;
  category_name: string;
  subcategory_id: string;
  subcategory_name: string;
  features?: ProductFeatures;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  sku: string;
  image_url: string;
  price: number;
  stock: number;
}

export interface ProductSearchResult {
  id: number;
  name: string;
  sku: string;
  category_name: string;
  subcategory_name: string;
  image_url: string;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
}

export interface ProductSearchResponse {
  data: {
    pagination: Pagination;
    results: ProductSearchResult[];
  };
  message: string;
}

export interface ProductFilterBySkuResponse {
  data: {
    pagination: Pagination;
    products: Product[];
  };
  message: string;
}

export interface ProductVariationsResponse {
  data: ProductVariation[];
  message: string;
} 