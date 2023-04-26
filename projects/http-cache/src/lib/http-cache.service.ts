import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface CacheEntry<T> {
  value?: HttpResponse<T>;
  resolvedAt?: number;
}

@Injectable()
export class HttpCacheService {
  private readonly cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Create {@code string} key used by internal cache.
   * If input parameter is {@link HttpReqeust}, `urlWithParams` property will be used as a key.
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   * @returns key
   */
  private static getKey<T>(requestOrKey: HttpRequest<T> | string): string {
    return requestOrKey instanceof HttpRequest ? requestOrKey.urlWithParams : requestOrKey;
  }

  /**
   * Check if {@link HttpRequest} is cached.
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   * @returns {boolean}
   */
  public isCached<T>(requestOrKey: HttpRequest<T> | string): boolean {
    return this.cache.has(HttpCacheService.getKey(requestOrKey));
  }

  /**
   * Retrieve {@link CacheEntry} for cached {@link HttpRequest}.
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   * @returns {CacheEntry}
   */
  public getCached<T>(requestOrKey: HttpRequest<T> | string): CacheEntry<T> | undefined {
    return this.cache.get(HttpCacheService.getKey(requestOrKey));
  }

  /**
   * Detele {@link CacheEntry} for {@link HttpRequest}.
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   */
  public deleteCache<T>(requestOrKey: HttpRequest<T> | string): void {
    this.cache.delete(HttpCacheService.getKey(requestOrKey));
  }

  /**
   * Cache {@link HttpRespone} for given {@link HttpReqeust}
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   * @param {HttpRespone} value to be cached  
   */
  public cacheResponse<T>(requestOrKey: HttpRequest<T> | string, value: HttpResponse<T>): void {
    const key = HttpCacheService.getKey(requestOrKey);
    const entry = this.cache.get(key)!;

    this.cache.set(key, { ...entry, resolvedAt: Date.now(), value, });
  }
}