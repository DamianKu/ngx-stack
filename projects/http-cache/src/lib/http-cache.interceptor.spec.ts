
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { HttpCacheInterceptor } from './http-cache.interceptor';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import createSpy = jasmine.createSpy;

describe('HttpCacheInterceptor', () => {

  let interceptor: HttpCacheInterceptor;
  let http: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpCacheInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    interceptor = TestBed.inject(HttpCacheInterceptor);

  });
  //     HttpCacheInterceptor['cache'].clear();

  //   describe('isCacheRequest', () => {
  //     let headers: HttpHeaders;
  //     beforeEach(() => {
  //       headers = new HttpHeaders();
  //     });
  //     it('should return true if there is cache header in request headers', () => {
  //       expect(HttpCacheInterceptor['isCacheRequest']({ headers } as any)).toEqual(false);

  //       headers = headers.set(HttpCacheInterceptor['cacheHeaderName'], '');

  //       expect(HttpCacheInterceptor['isCacheRequest']({ headers } as any)).toEqual(true);
  //     });
  //   });

  //   describe('clearCacheHeaderFromReq', () => {
  //     let request;
  //     let cloneSpy;
  //     beforeEach(() => {
  //       spyOn<any>(HttpCacheInterceptor, 'clearHeaders').and.returnValue('clean headers');
  //       cloneSpy = createSpy();
  //       cloneSpy.and.returnValue('Request clone');
  //       request = { clone: cloneSpy };
  //     });
  //     it('should return result of clone called on request with updated headers to the result of clearHeaders static method', () => {
  //       expect(HttpCacheInterceptor['clearCacheHeaderFromReq'](request)).toEqual('Request clone' as any);

  //       expect(HttpCacheInterceptor['clearHeaders']).toHaveBeenCalled();
  //       expect(HttpCacheInterceptor['clearHeaders']).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['clearHeaders']).toHaveBeenCalledWith(request);

  //       expect(cloneSpy).toHaveBeenCalled();
  //       expect(cloneSpy).toHaveBeenCalledTimes(1);
  //       expect(cloneSpy).toHaveBeenCalledWith({
  //         headers: 'clean headers'
  //       });
  //     });
  //   });

  //   describe('isCached', () => {
  //     const request: any = { urlWithParams: 'KEY_123' };
  //     it('should return true if urlWithParams entry is defined in cache map', () => {
  //       expect(HttpCacheInterceptor['isCached'](request)).toEqual(false);

  //       HttpCacheInterceptor['cache'].set(request.urlWithParams, '123' as any);

  //       expect(HttpCacheInterceptor['isCached'](request)).toEqual(true);
  //     });
  //   });

  //   describe('getCached', () => {
  //     const request: any = { urlWithParams: 'KEY_123' };
  //     it('should return value from cache map', () => {
  //       HttpCacheInterceptor['cache'].set(request.urlWithParams, '123' as any);

  //       expect(HttpCacheInterceptor['getCached'](request)).toEqual('123' as any);
  //     });
  //   });

  //   describe('setCacheSub', () => {
  //     const request: any = { urlWithParams: 'KEY_123' };
  //     it('should set new CacheReplaySubject in cache for given request', () => {
  //       HttpCacheInterceptor['setCacheSub'](request);

  //       expect(HttpCacheInterceptor['cache'].get(request.urlWithParams)).toEqual(new CacheReplaySubject(1));
  //     });
  //   });

  //   describe('deleteCacheSub', () => {
  //     it('should delete cache entry for given request', () => {
  //       HttpCacheInterceptor['cache'].set('test', 'test' as any);

  //       expect(HttpCacheInterceptor['cache'].get('test')).toBeDefined();
  //       HttpCacheInterceptor['deleteCacheSub']({ urlWithParams: 'test' } as any);
  //       expect(HttpCacheInterceptor['cache'].get('test')).toBeUndefined();
  //     });
  //   });

  //   describe('cacheResponse', () => {
  //     const request: any = { urlWithParams: 'KEY_123' };
  //     const response: any = { body: 123 };
  //     let rSub: CacheReplaySubject<any>;
  //     beforeEach(() => {
  //       rSub = new CacheReplaySubject(1);

  //       spyOn<any>(rSub, 'next').and.callThrough();
  //       spyOn<any>(rSub, 'complete').and.callThrough();

  //       HttpCacheInterceptor['cache'].set(request.urlWithParams, rSub);
  //     });
  //     it('should emit response on cached CacheReplaySubject', waitForAsync(() => {

  //       HttpCacheInterceptor['cacheResponse'](request, response);

  //       expect(rSub.next).toHaveBeenCalled();
  //       expect(rSub.next).toHaveBeenCalledTimes(1);
  //       expect(rSub.next).toHaveBeenCalledWith(response);

  //       expect(rSub.complete).toHaveBeenCalled();
  //       expect(rSub.complete).toHaveBeenCalledTimes(1);

  //       expect(rSub.closed).toBe(false);

  //       rSub.subscribe(result => {
  //         expect(result).toBe(response);
  //       });
  //     }));
  //   });

  //   describe('clearHeaders', () => {
  //     let headers: HttpHeaders;
  //     beforeEach(() => {
  //       headers = new HttpHeaders().set(HttpCacheInterceptor['cacheHeaderName'], '');
  //     });
  //     it('should return clone of headers with removed cache header', () => {
  //       expect(headers.has(HttpCacheInterceptor['cacheHeaderName'])).toEqual(true);
  //       headers = HttpCacheInterceptor['clearHeaders']({ headers } as any);
  //       expect(headers.has(HttpCacheInterceptor['cacheHeaderName'])).toEqual(false);
  //     });
  //   });

  //   describe('handleCacheRequest', () => {
  //     let isCachedSpy;
  //     const next: any = {};
  //     const request: any = { urlWithParams: 'url?with=params' };
  //     beforeEach(() => {
  //       isCachedSpy = spyOn<any>(HttpCacheInterceptor, 'isCached');
  //       spyOn<any>(HttpCacheInterceptor, 'getCached').and.returnValue(of('CACHED RESPONSE'));
  //       spyOn<any>(HttpCacheInterceptor, 'createCache').and.returnValue(of('NEW CACHED RESPONSE'));
  //     });
  //     it('should return observable of getCached result if response is cached', waitForAsync(() => {
  //       isCachedSpy.and.returnValue(true);
  //       const req = HttpCacheInterceptor['handleCacheRequest'](request, next);

  //       expect(req instanceof Observable).toEqual(true);

  //       expect(HttpCacheInterceptor['getCached']).toHaveBeenCalled();
  //       expect(HttpCacheInterceptor['getCached']).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['getCached']).toHaveBeenCalledWith(request);

  //       req.subscribe((res: any) => {
  //         expect(res).toEqual('CACHED RESPONSE');
  //       });

  //       expect(HttpCacheInterceptor['createCache']).not.toHaveBeenCalled();
  //     }));
  //     it('should return handler with attached cacheResponse pipe if response is not cached', waitForAsync(() => {
  //       isCachedSpy.and.returnValue(false);
  //       const req = HttpCacheInterceptor['handleCacheRequest'](request, next);

  //       expect(req instanceof Observable).toEqual(true);

  //       expect(HttpCacheInterceptor['createCache']).toHaveBeenCalled();
  //       expect(HttpCacheInterceptor['createCache']).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['createCache']).toHaveBeenCalledWith(request, next);

  //       req.subscribe((res: any) => {
  //         expect(res).toEqual('NEW CACHED RESPONSE');
  //       });

  //       expect(HttpCacheInterceptor['getCached']).not.toHaveBeenCalled();
  //     }));
  //   });

  //   describe('createCache', () => {
  //     let next;
  //     let responseSub;
  //     let isCompleteSpy;
  //     const request: any = { urlWithParams: 'url?with=params' };

  //     beforeEach(() => {
  //       isCompleteSpy = createSpy().and.returnValue(false);
  //       spyOn<any>(HttpCacheInterceptor, 'cacheResponse');
  //       spyOn<any>(HttpCacheInterceptor, 'setCacheSub');
  //       spyOn<any>(HttpCacheInterceptor, 'clearCacheHeaderFromReq').and.returnValue('CLEARED REQUEST');
  //       spyOn<any>(HttpCacheInterceptor, 'getCached').and.returnValue({
  //         isComplete: isCompleteSpy
  //       });
  //       spyOn<any>(HttpCacheInterceptor, 'deleteCacheSub');
  //       responseSub = new Subject();
  //       next = { handle: createSpy().and.returnValue(responseSub) };
  //     });

  //     it('should trigger setCacheSub', () => {
  //       HttpCacheInterceptor['createCache'](request, next);

  //       expect(HttpCacheInterceptor['setCacheSub']).toHaveBeenCalled();
  //       expect(HttpCacheInterceptor['setCacheSub']).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['setCacheSub']).toHaveBeenCalledWith(request);
  //     });
  //     it('should return handler with attached cacheResponse pipe', () => {
  //       const req = HttpCacheInterceptor['createCache'](request, next);

  //       expect(req instanceof Observable).toEqual(true);

  //       expect(next['handle']).toHaveBeenCalled();
  //       expect(next['handle']).toHaveBeenCalledTimes(1);
  //       expect(next['handle']).toHaveBeenCalledWith('CLEARED REQUEST');

  //       expect(HttpCacheInterceptor['clearCacheHeaderFromReq']).toHaveBeenCalled();
  //       expect(HttpCacheInterceptor['clearCacheHeaderFromReq']).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['clearCacheHeaderFromReq']).toHaveBeenCalledWith(request);

  //       req.subscribe((res: any) => {
  //         expect(res).toEqual({ type: HttpEventType.Response, body: 'NEW_RESPONSE' });

  //         expect(HttpCacheInterceptor['cacheResponse']).toHaveBeenCalled();
  //         expect(HttpCacheInterceptor['cacheResponse']).toHaveBeenCalledTimes(1);
  //         expect(HttpCacheInterceptor['cacheResponse']).toHaveBeenCalledWith(request, res);
  //       });

  //       responseSub.next({ type: HttpEventType.Sent }); // Should be ignored
  //       responseSub.next({ type: HttpEventType.Response, body: 'NEW_RESPONSE' });

  //     });
  //     it('should remove from cache if finalized without receiving complete response', () => {
  //       const req = CacheInterceptor['createCache'](request, next);

  //       req.subscribe().unsubscribe();

  //       expect(HttpCacheInterceptor['getCached']).toHaveBeenCalled();
  //       expect(HttpCacheInterceptor['getCached']).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['getCached']).toHaveBeenCalledWith(request);
  //       expect(isCompleteSpy).toHaveBeenCalled();
  //       expect(isCompleteSpy).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['deleteCacheSub']).toHaveBeenCalled();
  //       expect(HttpCacheInterceptor['deleteCacheSub']).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['deleteCacheSub']).toHaveBeenCalledWith(request);
  //     });

  //   });

  //   describe('intercept', () => {
  //     const request: any = { urlWithParams: 'url?with=params' };
  //     let next;
  //     let sub;
  //     let isCacheReqSpy;
  //     beforeEach(() => {
  //       isCacheReqSpy = spyOn<any>(CacheInterceptor, 'isCacheRequest');
  //       spyOn<any>(HttpCacheInterceptor, 'handleCacheRequest').and.returnValue(of());
  //       next = { handle: createSpy().and.returnValue(sub = new Subject()) };
  //     });
  //     it('should return result of handleCacheRequest if isCacheRequest returns true', () => {
  //       isCacheReqSpy.and.returnValue(true);
  //       const res: Observable<any> = interceptor['intercept'](request, next);

  //       expect(res).toEqual(jasmine.any(Observable));

  //       expect(isCacheReqSpy).toHaveBeenCalled();
  //       expect(isCacheReqSpy).toHaveBeenCalledTimes(1);
  //       expect(isCacheReqSpy).toHaveBeenCalledWith(request);

  //       expect(HttpCacheInterceptor['handleCacheRequest']).toHaveBeenCalled();
  //       expect(HttpCacheInterceptor['handleCacheRequest']).toHaveBeenCalledTimes(1);
  //       expect(HttpCacheInterceptor['handleCacheRequest']).toHaveBeenCalledWith(request, next);

  //       expect(next['handle']).not.toHaveBeenCalled();
  //     });
  //     it('should return request with next handler if isCacheRequest returns false', () => {
  //       isCacheReqSpy.and.returnValue(false);
  //       const res: Observable<any> = interceptor['intercept'](request, next);

  //       expect(res).toEqual(jasmine.any(Observable));

  //       expect(isCacheReqSpy).toHaveBeenCalled();
  //       expect(isCacheReqSpy).toHaveBeenCalledTimes(1);
  //       expect(isCacheReqSpy).toHaveBeenCalledWith(request);

  //       expect(HttpCacheInterceptor['handleCacheRequest']).not.toHaveBeenCalled();

  //       expect(next['handle']).toHaveBeenCalled();
  //       expect(next['handle']).toHaveBeenCalledTimes(1);
  //       expect(next['handle']).toHaveBeenCalledWith(request);
  //     });
  //   });

});
