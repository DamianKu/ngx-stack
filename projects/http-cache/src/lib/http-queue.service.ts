import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable()
export class HttpQueueService {
  private readonly queue: Map<string, ReplaySubject<HttpResponse<any>>> = new Map();

  /**
   * Check wheter {@link HttpRequest} is already in queue
   * @param {HttpRequest} request that will be checked against queue
   * @returns true if in queue
   */
  public isInQueue<T>({ urlWithParams }: HttpRequest<T>): boolean {
    return this.queue.has(urlWithParams);
  }

  /**
   * Get queue for given {@link HttpRequest}
   * @param {HttpRequest} request for which we will retrieve queue
   * @returns {@link ReplaySubject} of queue for {@link HttpRequest}
   */
  public getFromQueue<T>({ urlWithParams }: HttpRequest<T>): ReplaySubject<HttpResponse<T>> | undefined {
    return this.queue.get(urlWithParams);
  }

  /**
   * Add {@link HttpRequest} to queue
   * @param {HttpRequest} request for which we will create queue
   */
  public addToQueue<T>({ urlWithParams }: HttpRequest<T>): void {
    this.queue.set(urlWithParams, new ReplaySubject(1));
  }

  /**
   * Emit {@link HttpRespone} on {@link HttpRequest} queue
   * @param {HttpRequest} request on which queue response will be emitted
   * @param {HttpResponse} response that will be emitted 
   */
  public emit<T>(request: HttpRequest<T>, response: HttpResponse<T>): void {
    const sub = this.getFromQueue(request);
    sub?.next(response);

    // Complete ReplaySubject to allow promisified observables to resolve.
    sub?.complete();
  }

  /**
   * Remove queue for {@link HttpRequest}
   * @param {HttpRequest} request for which queue will be removed
   */
  public removeFromQueue<T>({ urlWithParams }: HttpRequest<T>): void {
    this.queue.delete(urlWithParams);
  }
}