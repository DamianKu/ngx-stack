import { HttpContext, HttpContextToken } from "@angular/common/http";

/**
 * {@link HttpContextToken} used to set {@link HttpRequest} as cachable
 */
export const HTTP_CACHE_TOKEN = new HttpContextToken<boolean>(() => false);

/**
 * Return a {@link HttpContext} that will cache {@link HttpRequest}
 * 
 * Usage
 * ```ts
 * http.get(URL, {context: cacheRequest()})
 * ```
 * @returns {HttpContext}
 */
export const cacheRequest = (): HttpContext => new HttpContext().set(HTTP_CACHE_TOKEN, true);
