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
  private readonly cache: Map<string, CacheReplaySubject<unknown>> = new Map();


  /**
   * Check if {@link HttpRequest} is cached.
   * @param {string} urlWithParams
   * @returns {boolean}
   */
  public isCached<T>({ urlWithParams }: HttpRequest<T>): boolean {
    return this.cache.has(urlWithParams);
  }

  /**
   * Retrieve {@link CacheReplaySubject} for cached {@link HttpRequest}.
   * @param {string} urlWithParams
   * @returns {CacheReplaySubject}
   */
  public getCached<T>({ urlWithParams }: HttpRequest<T>): CacheReplaySubject<T> {
    return this.cache.get(urlWithParams) as CacheReplaySubject<T>;
  }

  /**
   * Initialize cache for {@link HttpRequest}.
   * 
   * When initializing cache we create new {@link CacheReplaySubject} and store that. 
   * We do that so we can return this observable when another {@link HttpRequest} is made to the same URL. 
   * Returning this observable prevents {@link HttpClient} from making multiple calls.  
   * @param {string} urlWithParams
   */
  public initCache<T>({ urlWithParams }: HttpRequest<T>): void {
    this.cache.set(urlWithParams, new CacheReplaySubject());
  }

  /**
   * Detele {@link CacheReplaySubject} for {@link HttpRequest}.
   * @param {string} urlWithParams
   */
  public deleteCache<T>({ urlWithParams }: HttpRequest<T>): void {
    this.cache.delete(urlWithParams);
  }

  /**
   * Cache {@link HttpResponse} for given {@link HttpRequest}.
   * @param {HttpRequest<T>} request 
   * @param {HttpResponse<T>} response 
   */
  public cacheResponse<T>(request: HttpRequest<T>, response: HttpResponse<T>): void {
    const sub = this.getCached(request);
    sub.next(response);

    /*
      Complete CacheReplaySubject to allow promisified observables to resolve.
     */
    sub.complete();
  }
}