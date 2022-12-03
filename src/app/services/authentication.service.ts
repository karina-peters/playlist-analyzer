import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  public requestAccess(showDialog?: boolean) {
    const SCOPES = "user-read-private%20user-read-email";
    const SHOW_DIALOG = showDialog ? showDialog : false;

    document.location.href =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${environment.CLIENT_ID}&redirect_uri=${environment.REDIRECT_URI}` +
      `&scope=${SCOPES}&show_dialog=${SHOW_DIALOG}&response_type=code&state=123`;
  }

  public requestToken(queryString: string) {
    const code = this.getCode(queryString);

    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${environment.REDIRECT_URI}`;
    const headers = this.getHeaders();

    this.http
      .post("https://accounts.spotify.com/api/token", body, { headers })
      .subscribe((response: any) => {
        localStorage.setItem("access_token", response?.access_token);
        localStorage.setItem("refresh_token", response?.refresh_token);
      });
  }

  public refreshToken() {
    const refresh_token = localStorage.getItem("refresh_token");

    const body = `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${environment.CLIENT_ID}`;
    const headers = this.getHeaders();

    this.http
      .post("https://accounts.spotify.com/api/token", body, { headers })
      .subscribe((response: any) => {
        localStorage.setItem("access_token", response?.access_token);
        localStorage.setItem("refresh_token", response?.refresh_token);
      });
  }

  public getHeaders() {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":
        "Basic " +
        btoa(environment.CLIENT_ID + ":" + environment.CLIENT_SECRET),
    };
  }

  public getCode(queryString: string): string {
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");

    return code ? code : "";
  }
}
