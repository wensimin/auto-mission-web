import {Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {SnackBarServiceService} from "./snack-bar-service.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {


  constructor(
    private snackBarServiceService: SnackBarServiceService) {
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = "发生未知错误"
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            message = "登录已过期,请重新登录"
            break
          case HttpStatusCode.InternalServerError:
            message = "服务器发生未知错误"
            break
          case HttpStatusCode.Forbidden:
            message = "权限不足,无法访问"
            break
          case HttpStatusCode.NotFound:
            message = "未找到对应资源"
        }
        this.snackBarServiceService.message({type: "error", message: message})
        // 传递到下级
        return throwError(() => error);
      })
    );
  }
}
