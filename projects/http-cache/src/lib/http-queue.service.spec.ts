import { TestBed, fakeAsync } from "@angular/core/testing";
import { HttpQueueService } from "./http-queue.service";
import { HttpRequest, HttpResponse } from "@angular/common/http";
import { ReplaySubject } from "rxjs";
import { createMockHttpRequest } from "./http.spec-utils";

describe('HttpQueueService', () => {
  let httpQueueService: HttpQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpQueueService,
      ]
    });
    httpQueueService = TestBed.inject(HttpQueueService);
  });


  describe('isInQueue', () => {
    it('should return true if HttpRequest is in queue', () => {
      const mockHttpRequest = createMockHttpRequest();
      expect(httpQueueService.isInQueue(mockHttpRequest)).toEqual(false);

      httpQueueService.addToQueue(mockHttpRequest);

      expect(httpQueueService.isInQueue(mockHttpRequest)).toEqual(true);
    });
  });

  describe('getFromQueue', () => {
    it('should return queue ReplaySubject if in queue, undefined otherwise', () => {
      const mockHttpRequest = createMockHttpRequest();
      expect(httpQueueService.getFromQueue(mockHttpRequest)).toBeUndefined();

      httpQueueService.addToQueue(mockHttpRequest);

      const queueEntry = httpQueueService.getFromQueue(mockHttpRequest)

      expect(queueEntry).not.toBeUndefined();
    });
  });

  describe('addToQueue', () => {
    it('should add ReplaySubject to queue', () => {
      const mockHttpRequest = createMockHttpRequest();
      expect(httpQueueService.getFromQueue(mockHttpRequest)).toBeUndefined();

      httpQueueService.addToQueue(mockHttpRequest);

      expect(httpQueueService.getFromQueue(mockHttpRequest)).toBeInstanceOf(ReplaySubject);
    });
  });

  describe('emit', () => {
    let mockHttpRequest: HttpRequest<any>;
    let mockHttpResponse: HttpResponse<any>;
    beforeEach(() => {
      mockHttpRequest = createMockHttpRequest();
      mockHttpResponse = new HttpResponse();
    });

    it('should emit HttpRespone on queue ReplaySubject', fakeAsync(() => {
      httpQueueService.addToQueue(mockHttpRequest);

      const queueObs = httpQueueService.getFromQueue(mockHttpRequest);

      // Subscribe before emit
      queueObs?.subscribe(response => expect(response).toEqual(mockHttpResponse));

      httpQueueService.emit(mockHttpRequest, mockHttpResponse);

      // Subscribe after emit
      queueObs?.subscribe(response => expect(response).toEqual(mockHttpResponse));

      // Queue observable is completed
      expect(queueObs?.isStopped).toBeTrue();
    }));

    it('should not throw when queue item doesn\'t exist', () => {
      expect(() => {
        httpQueueService.emit(mockHttpRequest, mockHttpResponse);
      }).not.toThrow();
    });
  });

  describe('removeFromQueue', () => {
    it('should remove queue entry for HttpRequest', () => {
      const mockHttpRequest1 = createMockHttpRequest('request?id=1');
      const mockHttpRequest2 = createMockHttpRequest('request?id=2');

      expect(httpQueueService.getFromQueue(mockHttpRequest1)).toBeUndefined();
      expect(httpQueueService.getFromQueue(mockHttpRequest2)).toBeUndefined();

      httpQueueService.addToQueue(mockHttpRequest1);
      httpQueueService.addToQueue(mockHttpRequest2);

      expect(httpQueueService.getFromQueue(mockHttpRequest1)).not.toBeUndefined();
      expect(httpQueueService.getFromQueue(mockHttpRequest2)).not.toBeUndefined();

      httpQueueService.removeFromQueue(mockHttpRequest2);

      expect(httpQueueService.getFromQueue(mockHttpRequest1)).not.toBeUndefined();
      expect(httpQueueService.getFromQueue(mockHttpRequest2)).toBeUndefined();

      httpQueueService.removeFromQueue(mockHttpRequest1);

      expect(httpQueueService.getFromQueue(mockHttpRequest1)).toBeUndefined();
      expect(httpQueueService.getFromQueue(mockHttpRequest2)).toBeUndefined();
    });
  });
});