import { HttpContext, HttpContextToken } from "@angular/common/http";

/**
 * 
 */
export const HTTP_CACHE_TOKEN = new HttpContextToken<boolean>(() => false);

/**
 * 
 * @returns 
 */
export const cacheRequest = () => new HttpContext().set(HTTP_CACHE_TOKEN, true);
