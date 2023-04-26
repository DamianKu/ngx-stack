import { Injectable } from "@angular/core";
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http"
import { Observable, of } from "rxjs";
import { filter, tap, finalize } from 'rxjs/operators'
import { CacheEntry, HttpCacheService } from "./http-cache.service";
import { HTTP_CACHE_TOKEN } from "./http-cache";
import { HttpQueueService } from "./http-queue.service";

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {

  /**
   * Return {@link CacheEntry} value as Observable.
   * We assume that {@link CacheEntry} is defined and {@link CacheEntry['value']} is also defined.
   * @param {CacheEntry} entry 
   * @returns {Observable<NonNullable<CacheEntry<T>['value']>} Observable of cache entry value
   */
  private static asObservable<T>(entry: CacheEntry<T> | undefined): Observable<NonNullable<CacheEntry<T>['value']>> {
    return of(entry!.value!);
  }

  constructor(private readonly cacheService: HttpCacheService,
    private readonly queueService: HttpQueueService) { }

  /**
   * Check if {@link HttpRequest} {@link HttpContext} contains {@link HTTP_CACHE_TOKEN}.
   * @param {HttpContext} context 
   * @returns {boolean}
   */
  private isCacheRequest<T>({ context }: HttpRequest<T>): boolean {
    return context.get(HTTP_CACHE_TOKEN);
  }

  /**
   * If value is already cached, return observable of that value.
   * If value is not cached, but request is already in the queue, return observable of that queued request.
   * If value is not cached and request wasn't yet made, create new cache. 
   * 
   * @param {HttpRequest} request 
   * @param {HttpHandler} next 
   * @returns {Observable<HttpEvent>}
   */
  private handleCacheRequest<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return this.cacheService.isCached(request)
      ? HttpCacheInterceptor.asObservable(this.cacheService.getCached(request))
      : this.queueService.isInQueue(request)
        ? this.queueService.getFromQueue(request)!
        : this.createCache(request, next)
  }

  /**
   * Create new cache for {@link HttpRequest}.
   * Initialize queue on the {@link queueService} so next {@link HttpRequest} to the same URL will prevent multiple requests from being made.
   * @param {HttpRequest} request 
   * @param {HttpHandler} next 
   * @returns {Observable<HttpEvent>}
   */
  private createCache<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    this.queueService.addToQueue(request);

    return next
      .handle(request)
      .pipe(
        filter(response => response.type === HttpEventType.Response),
        tap(response => {
          this.cacheService.cacheResponse(request, response as HttpResponse<T>);
          this.queueService.emit(request, response as HttpResponse<T>);
        }),
        finalize(() => this.queueService.removeFromQueue(request))
      );
  }

  /**
   * Check if {@link HttpRequest} is supposed to be cached.
   * Return cached {@link Observable} of the cached request.
   * Do nothing if {@link HttpRequest} is not supposed to be cached.
   * @param {HttpRequest} request 
   * @param {HttpHandler} next 
   * @returns {Observable<HttpEvent>}
   */
  intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return this.isCacheRequest(request)
      ? this.handleCacheRequest(request, next)
      : next.handle(request);
  }
}