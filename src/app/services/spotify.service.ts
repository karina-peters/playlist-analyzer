import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  public getPlaylists(): Observable<Array<any>> {
    return this.http
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization:
            "Bearer " + window.localStorage.getItem("access_token"),
        },
        params: {
          limit: 50,
        },
      })
      .pipe(
        map((response: any) => response?.items),
        catchError((error) => {
          // if error.status == 401
          throw error;
        })
      );
  }

  public getTracks(uri: string): Observable<Array<any>> {
    return this.http
      .get(uri, {
        headers: {
          Authorization:
            "Bearer " + window.localStorage.getItem("access_token"),
        },
      })
      .pipe(
        map((response: any) => response?.items),
        catchError((error) => {
          throw error;
        })
      );
  }
}
