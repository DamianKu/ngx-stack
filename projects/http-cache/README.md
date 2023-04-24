# @ngx-stack/http-cache

`@ngx-stack/http-cache` is an Angular library that provides simple caching capabilities for HTTP requests in Angular applications. It is designed to work with the `HttpClient` service provided by Angular.

`@ngx-stack/http-cache` deals with multiple requests to the same endpoint, making sure that only one HTTP request is made, and subsequent requests are served from the cache. This library uses `HttpContext` to enable caching, instead of a most common approach of using request headers.

## Installation

To install `@ngx-stack/http-cache`, run the following command in your Angular project:

```bash
npm install --save @ngx-stack/http-cache
```

## Usage

### HTTP Cache

To use `@ngx-stack/http-cache`, import the `HttpCacheModule` in your Angular module:

```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpCacheModule } from '@ngx-stack/http-cache';

@NgModule({
  imports: [
    HttpClientModule,
    HttpCacheModule,
    // ...
  ],
  // ...
})
export class AppModule {}
```

Once the `HttpCacheModule` is imported, you can use the `cacheRequest` method provided by the `HttpClient` service to cache HTTP requests:

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cacheRequest } from '@ngx-stack/http-cache';

@Component({
  selector: 'app-root',
  template: `
    <h1>Posts</h1>
    <ul>
      <li *ngFor="let post of posts">{{ post.title }}</li>
    </ul>
  `,
})
export class AppComponent {
  posts: any[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const url = 'https://jsonplaceholder.typicode.com/posts';

    this.http.get<any[]>(url, { context: cacheRequest() }).subscribe(posts => {
      this.posts = posts;
    });
  }
}
```