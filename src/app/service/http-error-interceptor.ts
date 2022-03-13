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
      catchError((response: HttpErrorResponse) => {
        let message = "未能连接到服务器"
        let unKnownError = true
        switch (response.status) {
          case HttpStatusCode.Unauthorized:
            message = "登录已过期,请重新登录"
            break
          case HttpStatusCode.InternalServerError:
            unKnownError = HttpErrorInterceptor.isUnknownError(response)
            if (unKnownError) message = "服务器发生未知错误"
            break
          case HttpStatusCode.Forbidden:
            message = "权限不足,无法访问"
            break
          case HttpStatusCode.NotFound:
            message = "未找到对应资源"
            break
        }
        // 只有 未知才被公共处理
        if (unKnownError) this.snackBarServiceService.message({type: "error", message: message})
        // 传递到下级
        return throwError(() => response);
      })
    );
  }

  private static isUnknownError(response: HttpErrorResponse): boolean {
    let error = response.error
    console.log(error["message"])
    return error["error"] === "ERROR"
  }
}

export enum ErrorType {
  ERROR = "ERROR",
  DEBUG_LIMIT = "DEBUG_LIMIT",
}

