import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  /**
   * Routes to a uri containing an access code.
   * @param {boolean} showDialog - Whether or not the Spotify account access dialog should be shown
   */
  public requestAccess(showDialog?: boolean) {
    const SCOPES =
      "user-read-private%20user-read-email%20user-library-read%20playlist-read-private%20playlist-modify-public%20playlist-modify-private";
    const SHOW_DIALOG = showDialog ? showDialog : false;

    document.location.href =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${environment.CLIENT_ID}&redirect_uri=${environment.REDIRECT_URI}` +
      `&scope=${SCOPES}&show_dialog=${SHOW_DIALOG}&response_type=code&state=123`;
  }

  /**
   * Requests a new authorization token and updates the access_token and refresh_token in local storage.
   * @param {string} queryString - A string containing the access code
   * @returns True if the access and refresh tokens have been updated, false otherwise
   */
  public requestToken(queryString: string): Observable<boolean> {
    const code = this.getCode(queryString);

    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${environment.REDIRECT_URI}`;
    const headers = this.getHeaders();

    return this.http.post("https://accounts.spotify.com/api/token", body, { headers }).pipe(
      map((response: any) => {
        const accessToken = response?.access_token;
        const refreshToken = response?.refresh_token;

        if (accessToken && refreshToken) {
          this.setTokens(accessToken, refreshToken);
          return true;
        }

        return false;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return of(false);
      })
    );
  }

  /**
   * Requests a new authorization token and updates the access_token in local storage.
   * @returns True if the access token has been updated, false otherwise
   */
  public refreshToken(): Observable<boolean> {
    const refresh_token = localStorage.getItem("refresh_token");

    const body = `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${environment.CLIENT_ID}`;
    const headers = this.getHeaders();

    return this.http.post("https://accounts.spotify.com/api/token", body, { headers }).pipe(
      map((response: any) => {
        const accessToken = response?.access_token;

        if (accessToken) {
          this.setTokens(accessToken);
          return true;
        }

        return false;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error.message);
        return of(false);
      })
    );
  }

  private getHeaders(): { [header: string]: string } {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(environment.CLIENT_ID + ":" + environment.CLIENT_SECRET),
    };
  }

  private getCode(queryString: string): string {
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");

    return code ? code : "";
  }

  private setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem("access_token", accessToken);

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
  }
}
