import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { EMPTY, forkJoin, Observable, of } from "rxjs";
import { catchError, expand, map, reduce } from "rxjs/operators";
import { IPlaylistsDTO, IPlaylistTrackDTO, IArtistDTO, ISearchResultsDTO, IUserDTO } from "../models/spotify-response.models";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  private cache: { [key: number]: any } = {};
  constructor(private http: HttpClient) {}

  /**
   * Retrieves current user data from Spotify.
   * @returns An Observable containing user data the Spotify me endpoint
   */
  public getCurrentUser(): Observable<IUserDTO> {
    return this.getOne("https://api.spotify.com/v1/me").pipe(
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
   * Retrieves all items for the provided playlist id from Spotify.
   * @param id - The id of the playlist
   * @returns An Observable containing the response items from the Spotify playlists/{id}/tracks endpoint
   */
  public getPlaylistItems(id: string): Observable<Array<IPlaylistTrackDTO>> {
    return this.getNext(`https://api.spotify.com/v1/playlists/${id}/tracks`).pipe(
      expand((response: any) => (response?.next ? this.getNext(response.next) : EMPTY)),
      map((response: any) => response.items),
      reduce((accumulator, value) => accumulator.concat(value)),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves the saved status of the given track(s) from Spotify.
   * @param ids - An array of track ids
   * @returns An Observable containing the response from the Spotify me/tracks/contains endpoint
   */
  public checkSavedTracks(ids: Array<string>): Observable<Array<boolean>> {
    return this.getSeveral("https://api.spotify.com/v1/me/tracks/contains", ids).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves artist data from Spotify.
   * @param ids - A list of artist ids
   * @returns An Observable containing the response from the Spotify artists endpoint
   */
  public getSeveralArtists(ids: Array<string>, limit?: number): Observable<Array<IArtistDTO>> {
    return this.getSeveral("https://api.spotify.com/v1/artists", ids, limit).pipe(
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

  private getNext(url: string): Observable<any> {
    let key = this.hash(url);
    if (this.cache.hasOwnProperty(key)) {
      return of(this.cache[key]);
    }

    return this.http
      .get(url, {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        },
        params: {
          limit: 50,
        },
      })
      .pipe(map((response: any) => this.cacheRequest(key, response)));
  }

  private getOne(url: string): Observable<any> {
    let key = this.hash(url);
    if (this.cache.hasOwnProperty(key)) {
      return of(this.cache[key]);
    }

    return this.http
      .get(url, {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        },
      })
      .pipe(map((response: any) => this.cacheRequest(key, response)));
  }

  private getSeveral(url: string, ids: Array<string>, limit?: number): Observable<any> {
    let key = this.hash(url + ids.join(""));
    if (this.cache.hasOwnProperty(key)) {
      return of(this.cache[key]);
    }

    let idStrings = this.arrayToCSV(ids, limit);
    return forkJoin(
      idStrings.map((idString) =>
        this.http.get(url, {
          headers: {
            Authorization: "Bearer " + window.localStorage.getItem("access_token"),
          },
          params: {
            ids: idString,
          },
        })
      )
    ).pipe(
      map((response: any) => {
        return response.map((obj: any) => {
          if (Array.isArray(obj)) return obj;
          return obj[Object.keys(obj)[0]];
        });
      }),
      map((response: any) => [].concat(...response)),
      map((response: any) => this.cacheRequest(key, response))
    );
  }

  private arrayToCSV(items: Array<string>, limit: number = 50): Array<string> {
    let csvStrings: Array<string> = [];
    for (let i = 0; i < Math.ceil(items.length / limit); i++) {
      csvStrings.push(
        items
          .slice(i * limit, (i + 1) * limit)
          .filter((x) => x)
          .join(",")
      );
    }

    return csvStrings;
  }

  private hash(key: string): number {
    let hash = 0,
      chr;

    for (let i = 0; i < key.length; i++) {
      chr = key.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }

    return hash;
  }

  private cacheRequest(key: number, response: any) {
    if (key && !this.cache.hasOwnProperty(key)) {
      this.cache[key] = response;
    }

    return response;
  }
}
