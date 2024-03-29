import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError, timer } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AlertService } from "./services/alert.service";
import { AuthenticationService } from "./services/authentication.service";

@Injectable()
export class MonitorInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService, private authService: AuthenticationService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error) => {
        return this.handleResponseError(error, request, next);
      })
    );
  }

  private handleResponseError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Business error
    if (error.status === 400) {
      this.alertService.error(`${error.status}: Bad Request`);
    }

    // Invalid token error
    else if (error.status === 401) {
      if (localStorage.getItem("refresh_token")) {
        return this.authService.refreshToken().pipe(
          switchMap((success: boolean) => {
            if (success) {
              request = this.updateAuthHeader(request);
              return next.handle(request);
            }

            return of();
          })
        );
      } else {
        this.authService.requestAccess(true);
      }
    }

    // Access denied error
    else if (error.status === 403) {
      // Show message
    }

    // Rate limit error
    else if (error.status === 429) {
      console.error("Rate limit exceeded. Retrying in 30s.");

      return timer(30000).pipe(
        switchMap(() => {
          console.info("Retrying...");
          return next.handle(request);
        })
      );
    }

    // Server error
    else if (error.status === 500) {
      this.alertService.error(`${error.status}: Internal Server Error`);
    }

    // Maintenance error
    else if (error.status === 503) {
      this.alertService.error(`${error.status}: Server Unavailable`);
    }

    // Unknown error
    else {
      this.alertService.error(`${error.status}: Unknown Error`);
    }

    return throwError(error);
  }

  private updateAuthHeader(request: HttpRequest<any>) {
    const token = window.localStorage.getItem("access_token");
    return request.clone({
      setHeaders: {
        "Authorization": "Bearer " + token,
      },
    });
  }
}
