import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HttpCacheService } from "./http-cache.service";
import { HttpCacheInterceptor } from "./http-cache.interceptor";
import { HttpQueueService } from "./http-queue.service";

@NgModule({
  providers: [
    HttpCacheService,
    HttpQueueService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCacheInterceptor,
      multi: true,
    }
  ]
})
export class HttpCacheModule { }