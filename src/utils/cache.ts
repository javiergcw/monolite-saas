interface CacheItem {
  data: any;
  expiresAt: number;
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set(key: string, data: any, ttl: number = 60): void {
    const expiresAt = Date.now() + (ttl * 1000);
    this.cache.set(key, { data, expiresAt });
  }

  public get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  public clear(): void {
    this.cache.clear();
  }
}

const cache = Cache.getInstance();

export const setCache = (key: string, data: any, ttl: number = 60): void => {
  cache.set(key, data, ttl);
};

export const getCache = (key: string): any | null => {
  return cache.get(key);
};

export const clearCache = (): void => {
  cache.clear();
}; 