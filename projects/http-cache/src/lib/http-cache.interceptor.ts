import { Injectable } from "@angular/core";
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs";
import { filter, tap, finalize } from 'rxjs/operators'
import { HttpCacheService } from "./http-cache.service";
import { HTTP_CACHE_TOKEN } from "./http-cache";

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {

  constructor(private readonly cacheService: HttpCacheService) { }

  /**
   * Check if {@link HttpRequest} {@link HttpContext} contains {@link HTTP_CACHE_TOKEN}.
   * @param {HttpContext} context 
   * @returns {boolean}
   */
  private isCacheRequest<T>({ context }: HttpRequest<T>): boolean {
    return context.get(HTTP_CACHE_TOKEN);
  }

  /**
   * Return observable with cached {@link HttpResponse} if exists, create cache otherwise.
   * @param {HttpRequest} request 
   * @param {HttpHandler} next 
   * @returns {Observable<HttpEvent>}
   */
  private handleCacheRequest<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return this.cacheService.isCached(request)
      ? this.cacheService.getCached(request)
      : this.createCache(request, next);
  }

  /**
   * Create new cache for {@link HttpRequest}.
   * Initialize cache on the {@link cacheService} so next {@link HttpRequest} to the same URL will return that cache.
   * @param {HttpRequest} request 
   * @param {HttpHandler} next 
   * @returns {Observable<HttpEvent>}
   */
  private createCache<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    this.cacheService.initCache(request);

    return next
      .handle(request)
      .pipe(
        filter(response => response.type === HttpEventType.Response),
        tap(response => this.cacheService.cacheResponse(request, response as HttpResponse<T>)),
        finalize(() => {
          if (!this.cacheService.getCached(request).isComplete()) {
            // Http observable was canceled before finishing. Clear cache as it will never resolve
            this.cacheService.deleteCache(request);
          }
        })
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