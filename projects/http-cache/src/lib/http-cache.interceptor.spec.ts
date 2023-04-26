import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpContext, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { HttpCacheInterceptor } from './http-cache.interceptor';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { pipe } from 'rxjs';
import { HTTP_CACHE_TOKEN, cacheRequest } from './http-cache';
import { HttpCacheService } from './http-cache.service';
import { filter, map } from 'rxjs/operators';
import { HttpQueueService } from './http-queue.service';

function httpClientTestRequestPipe() {
  return pipe(
    filter((res: HttpEvent<unknown>) => res.type === HttpEventType.Response),
    map((res: any) => res.body),
  )
}

describe('HttpCacheInterceptor', () => {
  let http: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpQueueService,
        HttpCacheService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpCacheInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  describe('intercept', () => {

    const NON_CACHING_CONTEXT: (HttpContext | undefined)[] = [
      undefined,
      new HttpContext(),
      new HttpContext().set(HTTP_CACHE_TOKEN, false),
    ];

    NON_CACHING_CONTEXT.forEach(context => {
      it('should do nothing if HttpRequest is not cachable', fakeAsync(() => {
        const request = new HttpRequest('GET', 'URL', {}, { context });

        httpClient.request(request).subscribe();
        httpClient.request(request).subscribe();

        const req = http.match(request);

        // 2 HTTP calls were made
        expect(req.length).toEqual(2);
        expect(req[0].request).toEqual(request);
        expect(req[1].request).toEqual(request);

        http.verify();
      }));
    });


    const CACHING_CONTEXT: HttpContext[] = [
      cacheRequest(),
      new HttpContext().set(HTTP_CACHE_TOKEN, true),
    ];

    CACHING_CONTEXT.forEach(context => {
      it('should make only one HTTP call if HttpRequest is cachable', fakeAsync(() => {
        const request = new HttpRequest('GET', 'URL', {}, { context });

        httpClient.request(request).subscribe();
        httpClient.request(request).subscribe();

        const req = http.match(request);

        expect(req.length).toEqual(1);
        expect(req[0].request).toEqual(request);

        http.verify();
      }));

      it('should emit cached value', fakeAsync(() => {
        const request = new HttpRequest('GET', 'URL', null, { context });
        const response = { id: 123, data: { whoAmI: 'beep boop I am a computer' } };

        httpClient.request(request)
          .pipe(httpClientTestRequestPipe())
          .subscribe(r => expect(r).toEqual(response));

        httpClient.request(request)
          .pipe(httpClientTestRequestPipe())
          .subscribe(r => expect(r).toEqual(response));

        // Only one request made
        const req = http.expectOne(request);
        req.flush(response);

        // HTTP is closed and cached value is emitted
        httpClient.request(request)
          .pipe(httpClientTestRequestPipe())
          .subscribe(r => expect(r).toEqual(response));

        http.verify();
      }));

      it('should clear cache if request finalized without completing', fakeAsync(() => {
        const request = new HttpRequest('GET', 'URL', null, { context });
        const response = { id: 123, data: { whoAmI: 'beep boop I am a computer' } };

        const reqObservable = httpClient.request(request)
          .subscribe();

        // Only one request made
        let req = http.expectOne(request);

        // Unsubscribe (close HTTP connection) before HTTP finished
        reqObservable.unsubscribe();

        // New request
        httpClient.request(request)
          .pipe(httpClientTestRequestPipe())
          .subscribe(r => expect(r).toEqual(response));

        req = http.expectOne(request);
        req.flush(response);

        http.verify();
      }));
    });
  });
});
