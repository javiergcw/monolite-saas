export interface CacheConfig {
  ttl: number;
  tags?: string[];
}

export interface CacheStrategy {
  shared: {
    get<T>(key: string): T | null;
    set<T>(key: string, data: T, config: CacheConfig): void;
    invalidate(tags: string[]): void;
    clear(): void;
  };
  user: {
    get<T>(userId: string, key: string): T | null;
    set<T>(userId: string, key: string, data: T, config: CacheConfig): void;
    invalidate(userId: string, tags: string[]): void;
  };
} 