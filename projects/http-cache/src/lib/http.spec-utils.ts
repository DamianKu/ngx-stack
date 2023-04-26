import { HttpRequest, HttpResponse } from "@angular/common/http";

export function createMockHttpRequest(urlWithParams = 'www.url.com?id=15') {
  return new HttpRequest('GET', urlWithParams);
}

export function createMockHttpResponse(body: any = { testBody: 123 }) {
  return new HttpResponse({ body });
}
