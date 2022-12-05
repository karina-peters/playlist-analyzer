import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthenticationService } from "./services/authentication.service";

@Injectable()
export class MonitorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private router: Router) {}

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
      // Show message
    }

    // Invalid token error
    else if (error.status === 401) {
      return this.authService.refreshToken().pipe(
        switchMap((success: boolean) => {
          if (success) {
            request = this.updateAuthHeader(request);
            return next.handle(request);
          }

          this.logout();
          return of();
        })
      );
    }

    // Access denied error
    else if (error.status === 403) {
      // Show message
      this.logout();
    }

    // Server error
    else if (error.status === 500) {
      // Show message
    }

    // Maintenance error
    else if (error.status === 503) {
      // Show message
      // Redirect to the maintenance page
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

  private logout() {
    this.router.navigateByUrl("");
  }
}