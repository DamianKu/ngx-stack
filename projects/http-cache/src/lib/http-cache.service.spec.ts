import { TestBed, fakeAsync } from "@angular/core/testing";
import { CacheReplaySubject, HttpCacheService } from "./http-cache.service";
import { HttpRequest, HttpResponse } from "@angular/common/http";

function createMockHttpRequest(urlWithParams = 'www.url.com?id=15') {
  return new HttpRequest('GET', urlWithParams);
}

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

      // Initialize cache for mocked request
      httpCacheService.initCache(mockHttpRequest);

      expect(httpCacheService.isCached(mockHttpRequest)).toEqual(true);
      expect(httpCacheService.isCached(mockHttpRequest.urlWithParams)).toEqual(true);
    });
  });

  describe('getCached', () => {
    it('should return cached CacheReplaySubject if HttpRequest is cached, undefined otherwise', () => {
      const mockHttpRequest = createMockHttpRequest();
      expect(httpCacheService.getCached(mockHttpRequest)).toBeUndefined();

      // Initialize cache for mocked request
      httpCacheService.initCache(mockHttpRequest.urlWithParams);

      const cacheObs = httpCacheService.getCached(mockHttpRequest.urlWithParams);

      expect(cacheObs).toBeInstanceOf(CacheReplaySubject);
    });
  });

  describe('initCache', () => {
    it('should create new CacheReplaySubject and store it based on the urlWithParams of HttpRequest', () => {
      const mockHttpRequest1 = createMockHttpRequest('request?id=1');
      const mockHttpRequest2 = createMockHttpRequest('request?id=2');

      expect(httpCacheService.getCached(mockHttpRequest1)).toBeUndefined();
      expect(httpCacheService.getCached(mockHttpRequest2)).toBeUndefined();

      httpCacheService.initCache(mockHttpRequest1);

      const mockHttpRequestCached1 = httpCacheService.getCached(mockHttpRequest1);

      expect(mockHttpRequestCached1).toBeInstanceOf(CacheReplaySubject);
      expect(httpCacheService.getCached(mockHttpRequest2)).toBeUndefined();

      httpCacheService.initCache(mockHttpRequest2);

      const mockHttpRequestCached2 = httpCacheService.getCached(mockHttpRequest2);

      expect(mockHttpRequestCached2).toBeInstanceOf(CacheReplaySubject);
      expect(mockHttpRequestCached1).not.toBe(mockHttpRequestCached2);
    });
  });

  describe('deleteCache', () => {
    it('should remove cached entry for HttpRequest', () => {
      const mockHttpRequest1 = createMockHttpRequest('request?id=1');
      const mockHttpRequest2 = createMockHttpRequest('request?id=2');

      expect(httpCacheService.getCached(mockHttpRequest1)).toBeUndefined();
      expect(httpCacheService.getCached(mockHttpRequest2)).toBeUndefined();

      httpCacheService.initCache(mockHttpRequest1);
      httpCacheService.initCache(mockHttpRequest2);

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
    const response1 = { id: 123 } as unknown as HttpResponse<any>;
    const response2 = { id: 456 } as unknown as HttpResponse<any>
    let mockHttpRequest: HttpRequest<any>;
    let cacheEmits: HttpResponse<any>[];

    beforeEach(() => {
      mockHttpRequest = createMockHttpRequest();
      cacheEmits = [];
    });
    it('should cache response', fakeAsync(() => {
      // Initialize cache for mocked request
      httpCacheService.initCache(mockHttpRequest);

      // Subscribe to cached respone and push to 'cacheEmits'
      httpCacheService.getCached(mockHttpRequest)?.subscribe(cached => cacheEmits.push(cached));

      // Cache response
      httpCacheService.cacheResponse(mockHttpRequest, response1);
      httpCacheService.cacheResponse(mockHttpRequest, response2); // This is not emited

      // Response observable should be completed after first cached response
      expect(httpCacheService.getCached(mockHttpRequest)?.isComplete()).toBeTrue();

      expect(cacheEmits.length).toEqual(1);
      expect(cacheEmits[0]).toEqual(response1);

      // Subscribed after cache was completed also emits value
      httpCacheService.getCached(mockHttpRequest)?.subscribe(cached => {
        expect(cached).toEqual(response1);
      });
    }));
    it('should not throw when cache doesn\'t exist', () => {
      expect(() => {
        httpCacheService.cacheResponse(mockHttpRequest, response1);
      }).not.toThrow();
    });
  });
});