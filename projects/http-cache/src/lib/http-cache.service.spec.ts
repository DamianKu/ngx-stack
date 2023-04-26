import { TestBed, fakeAsync } from "@angular/core/testing";
import { HttpCacheService } from "./http-cache.service";
import { HttpRequest, HttpResponse } from "@angular/common/http";
import { createMockHttpRequest, createMockHttpResponse } from "./http.spec-utils";

describe('HttpCacheService', () => {
  let httpCacheService: HttpCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpCacheService,
      ]
    });
    httpCacheService = TestBed.inject(HttpCacheService);
  });

  describe('isCached', () => {
    it('should return true if HttpRequest is cached ', () => {
      const mockHttpRequest = createMockHttpRequest();
      expect(httpCacheService.isCached(mockHttpRequest)).toEqual(false);
      expect(httpCacheService.isCached(mockHttpRequest.urlWithParams)).toEqual(false);

      httpCacheService.cacheResponse(mockHttpRequest, createMockHttpResponse());

      expect(httpCacheService.isCached(mockHttpRequest)).toEqual(true);
      expect(httpCacheService.isCached(mockHttpRequest.urlWithParams)).toEqual(true);
    });
  });

  describe('getCached', () => {
    it('should return cached value if HttpRequest is cached, undefined otherwise', () => {
      const mockHttpRequest = createMockHttpRequest();
      const mockHttpRespone = createMockHttpResponse();
      expect(httpCacheService.getCached(mockHttpRequest)).toBeUndefined();

      httpCacheService.cacheResponse(mockHttpRequest.urlWithParams, mockHttpRespone);

      const cacheEntry = httpCacheService.getCached(mockHttpRequest.urlWithParams);

      expect(cacheEntry?.value).toEqual(mockHttpRespone);
    });
  });

  describe('deleteCache', () => {
    it('should remove cached entry for HttpRequest', () => {
      const mockHttpRequest1 = createMockHttpRequest('request?id=1');
      const mockHttpResponse1 = createMockHttpResponse({ vale: '123' });
      const mockHttpRequest2 = createMockHttpRequest('request?id=2');
      const mockHttpResponse2 = createMockHttpResponse({ value: '456' });

      expect(httpCacheService.getCached(mockHttpRequest1)).toBeUndefined();
      expect(httpCacheService.getCached(mockHttpRequest2)).toBeUndefined();

      httpCacheService.cacheResponse(mockHttpRequest1, mockHttpResponse1);
      httpCacheService.cacheResponse(mockHttpRequest2, mockHttpResponse2);

      expect(httpCacheService.getCached(mockHttpRequest1.urlWithParams)).not.toBeUndefined();
      expect(httpCacheService.getCached(mockHttpRequest2)).not.toBeUndefined();

      httpCacheService.deleteCache(mockHttpRequest2);

      expect(httpCacheService.getCached(mockHttpRequest1)).not.toBeUndefined();
      expect(httpCacheService.getCached(mockHttpRequest2.urlWithParams)).toBeUndefined();

      httpCacheService.deleteCache(mockHttpRequest1);

      expect(httpCacheService.getCached(mockHttpRequest1)).toBeUndefined();
      expect(httpCacheService.getCached(mockHttpRequest2)).toBeUndefined();
    });
  });

  describe('cacheResponse', () => {
    it('should cache response', fakeAsync(() => {
      let response1: HttpResponse<any> = createMockHttpResponse({ id: 123 });
      let mockHttpRequest: HttpRequest<any> = createMockHttpRequest();

      httpCacheService.cacheResponse(mockHttpRequest, response1);

      const entry = httpCacheService.getCached(mockHttpRequest)!;

      expect(entry.value).toEqual(response1);
      expect(entry.resolvedAt).toBeGreaterThanOrEqual(Date.now());
    }));
  });
});