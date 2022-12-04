import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves playlist data for the current user from Spotify.
   * @returns An Observable containing a list of playlists from the Spotify playlists endpoint
   */
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
          throw error;
        })
      );
  }

  /**
   * Retrieves track data from Spotify.
   * @param uri - The uri of the tracks to retrieve
   * @returns An Observable containing the response from the Spotify tracks endpoint
   */
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

  /**
   * Retrieves artist data from Spotify.
   * @param uri - The uri of the artist to retrieve
   * @returns An Observable containing the response from the Spotify artists endpoint
   */
  public getArtist(uri: string): Observable<any> {
    return this.http
      .get(uri, {
        headers: {
          Authorization:
            "Bearer " + window.localStorage.getItem("access_token"),
        },
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
