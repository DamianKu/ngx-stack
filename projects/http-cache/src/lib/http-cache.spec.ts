import { HTTP_CACHE_TOKEN, cacheRequest } from './http-cache';

describe('HttpCache', () => {
  describe('createCache', () => {
    it('should return HttpContext with HTTP_CACHE_TOKEN set to true', () => {
      const context = cacheRequest();

      expect(context.keys.length).toEqual(0);
      expect(context.get(HTTP_CACHE_TOKEN)).toEqual(true);
    });
  })
});