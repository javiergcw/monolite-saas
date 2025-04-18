import { AxiosError } from 'axios';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem<any>>;
  private tagMap: Map<string, Set<string>>;

  private constructor() {
    this.cache = new Map();
    this.tagMap = new Map();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set<T>(key: string, data: T, ttl: number = 60, tags?: string[]): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags
    };

    this.cache.set(key, item);

    // Mantener registro de tags para invalidación por categoría
    if (tags) {
      tags.forEach(tag => {
        if (!this.tagMap.has(tag)) {
          this.tagMap.set(tag, new Set());
        }
        this.tagMap.get(tag)?.add(key);
      });
    }
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  public clear(): void {
    this.cache.clear();
    this.tagMap.clear();
  }

  public invalidateByTag(tag: string): void {
    const keys = this.tagMap.get(tag);
    if (keys) {
      keys.forEach(key => this.cache.delete(key));
      this.tagMap.delete(tag);
    }
  }

  public invalidateByTags(tags: string[]): void {
    tags.forEach(tag => this.invalidateByTag(tag));
  }

  public getSize(): number {
    return this.cache.size;
  }

  public getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const cache = Cache.getInstance();

export const setCache = <T>(key: string, data: T, ttl: number = 60, tags?: string[]): void => {
  cache.set(key, data, ttl, tags);
};

export const getCache = <T>(key: string): T | null => {
  return cache.get(key);
};

export const clearCache = (): void => {
  cache.clear();
};

export const invalidateCacheByTag = (tag: string): void => {
  cache.invalidateByTag(tag);
};

export const invalidateCacheByTags = (tags: string[]): void => {
  cache.invalidateByTags(tags);
}; 