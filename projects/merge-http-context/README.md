# @ngx-stack/merge-http-context

The utility library for merging multiple Angular `HttpContext`s.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install @ngx-stack/merge-http-context
```

## Usage

```ts
import { mergeHttpContext } from "@ngx-stack/merge-http-context";

@Injectable()
export class AppService {
    private cacheContext: HttpContext = new HttpContext().set(CACHE_TOKEN, true);

    constructor(private http: HttpClient) {}

    public getSomething(): Observable<any>{
        return this.http.get(URL, {
            context: mergeHttpContext(
                new HttpContext().set(ID_TOKEN, "some value"),
                CACHE_CONTEXT
            )
        });
    }
}
```