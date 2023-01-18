import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { EMPTY, Observable } from "rxjs";
import { catchError, expand, map, reduce } from "rxjs/operators";
import { IPlaylistsDTO, IPlaylistTracksDTO, IArtistDTO, ISearchResultsDTO, IUserDTO } from "../models/spotify-response.models";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves current user data from Spotify.
   * @returns An Observable containing user data the Spotify me endpoint
   */
  public getCurrentUser(): Observable<IUserDTO> {
    return this.getNext("https://api.spotify.com/v1/me").pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves all playlists for the current user from Spotify.
   * @returns An Observable containing a list of playlists from the Spotify me/playlists endpoint
   */
  public getPlaylists(): Observable<Array<IPlaylistsDTO>> {
    return this.getNext("https://api.spotify.com/v1/me/playlists").pipe(
      expand((response: any) => (response?.next ? this.getNext(response.next) : EMPTY)),
      map((response: any) => response.items),
      reduce((accumulator, value) => accumulator.concat(value)),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves track data from Spotify.
   * @param uri - The uri of the tracks to retrieve
   * @returns An Observable containing the response from the Spotify tracks endpoint
   */
  public getTracks(uri: string): Observable<Array<IPlaylistTracksDTO>> {
    return this.getNext(uri).pipe(
      expand((response: any) => (response?.next ? this.getNext(response.next) : EMPTY)),
      map((response: any) => response.items),
      reduce((accumulator, value) => accumulator.concat(value)),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves artist data from Spotify.
   * @param uri - The uri of the artist to retrieve
   * @returns An Observable containing the response from the Spotify artists endpoint
   */
  public getArtist(uri: string): Observable<IArtistDTO> {
    return this.http
      .get(uri, {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        },
      })
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          throw error;
        })
      );
  }

  /**
   * Retrieves search results from Spotify.
   * @param query - The search query from the user
   * @param type - A comma-separated list of item types to search across (e.g. "album,artist,track")
   * @returns An Observable containing the response from the Spotift search endpoint
   */
  public getSearchResults(query: string, type: string): Observable<ISearchResultsDTO> {
    return this.http
      .get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        },
        params: {
          q: query,
          type: type,
          limit: 10,
        },
      })
      .pipe(
        map((response: any) => response),
        catchError((error: HttpErrorResponse) => {
          throw error;
        })
      );
  }

  private getNext(link: string): Observable<any> {
    return this.http.get(link, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
      },
      params: {
        limit: 50,
      },
    });
  }
}
