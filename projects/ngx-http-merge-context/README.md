# @ngx-stack/ngx-http-merge-context

The utility library for merging multiple Angular `HttpContext`s.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install @ngx-stack/ngx-http-merge-context
```

## Usage

```ts
import { mergeHttpContext } from "@ngx-stack/ngx-http-merge-context";

...

this.http.get(URL, {
    context: mergeHttpContext(new HttpContext().set(SOME_TOKEN, "12345"), CACHE_CONTEXT)
});
```