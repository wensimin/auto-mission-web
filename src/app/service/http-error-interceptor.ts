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
import {SnackBarComponent} from "../snack-bar/snack-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {


  constructor(private snackBar: MatSnackBar) {
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
        }
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 5 * 1000,
          panelClass: ['snack-bar'],
          data: {type: "error", message: message}
        })
        // 传递到下级
        return throwError(() => error);
      })
    );
  }
}
