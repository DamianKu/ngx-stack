import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

export class CacheReplaySubject<T> extends ReplaySubject<HttpResponse<T>> {
  private completed: boolean = false;

  constructor() {
    /*
      Buffer size on ReplaySubject is 1 as we want to remember latest emitted value
    */
    super(1);
  }

  public isComplete(): boolean {
    return this.completed;
  }

  public complete(): void {
    this.completed = true;
    super.complete();
  }
}

@Injectable()
export class HttpCacheService {
  private readonly cache: Map<string, CacheReplaySubject<any>> = new Map();

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
   * Retrieve {@link CacheReplaySubject} for cached {@link HttpRequest}.
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   * @returns {CacheReplaySubject}
   */
  public getCached<T>(requestOrKey: HttpRequest<T> | string): CacheReplaySubject<T> | undefined {
    return this.cache.get(HttpCacheService.getKey(requestOrKey));
  }

  /**
   * Initialize cache for {@link HttpRequest}.
   * 
   * When initializing cache we create new {@link CacheReplaySubject} and store that. 
   * We do that so we can return this observable when another {@link HttpRequest} is made to the same URL. 
   * Returning this observable prevents {@link HttpClient} from making multiple calls.  
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   */
  public initCache<T>(requestOrKey: HttpRequest<T> | string): void {
    this.cache.set(HttpCacheService.getKey(requestOrKey), new CacheReplaySubject());
  }

  /**
   * Detele {@link CacheReplaySubject} for {@link HttpRequest}.
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   */
  public deleteCache<T>(requestOrKey: HttpRequest<T> | string): void {
    this.cache.delete(HttpCacheService.getKey(requestOrKey));
  }

  /**
   * Cache {@link HttpResponse} for given {@link HttpRequest}.
   * @param {HttpRequest | string} requestOrKey {@link HttpReqeust} or {@code string} key of cache entry
   * @param {HttpResponse<T>} response 
   */
  public cacheResponse<T>(requestOrKey: HttpRequest<T> | string, response: HttpResponse<T>): void {
    const sub = this.getCached(HttpCacheService.getKey(requestOrKey));
    sub?.next(response);

    /*
      Complete CacheReplaySubject to allow promisified observables to resolve.
     */
    sub?.complete();
  }
}