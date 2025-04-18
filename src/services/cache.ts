import { cache } from '../utils/cache';
import { CacheKeys } from '../types/cache.enums';
import { CacheConfig, CacheStrategy } from '../types/cache.interfaces';

class CacheService {
  private static instance: CacheService;
  private readonly userCache: Map<string, typeof cache>;

  private constructor() {
    this.userCache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public getStrategy(): CacheStrategy {
    return {
      shared: {
        get: <T>(key: string): T | null => cache.get<T>(key),
        set: <T>(key: string, data: T, config: CacheConfig): void => {
          cache.set(key, data, config.ttl, config.tags);
        },
        invalidate: (tags: string[]): void => {
          cache.invalidateByTags(tags);
        },
        clear: (): void => {
          cache.clear();
        }
      },
      user: {
        get: <T>(userId: string, key: string): T | null => {
          const userCache = this.getUserCache(userId);
          return userCache.get<T>(key);
        },
        set: <T>(userId: string, key: string, data: T, config: CacheConfig): void => {
          const userCache = this.getUserCache(userId);
          userCache.set(key, data, config.ttl, config.tags);
        },
        invalidate: (userId: string, tags: string[]): void => {
          const userCache = this.getUserCache(userId);
          userCache.invalidateByTags(tags);
        }
      }
    };
  }

  private getUserCache(userId: string): typeof cache {
    if (!this.userCache.has(userId)) {
      this.userCache.set(userId, cache);
    }
    return this.userCache.get(userId)!;
  }

  public clearAll(): void {
    cache.clear();
    this.userCache.clear();
  }
}

export const cacheService = CacheService.getInstance();
export const cacheStrategy = cacheService.getStrategy(); 