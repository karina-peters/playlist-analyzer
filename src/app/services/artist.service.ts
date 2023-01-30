import { Injectable } from "@angular/core";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";
import { IArtistDTO } from "src/app/models/spotify-response.models";

export interface Artist {
  id: string;
  link: string;
  name: string;
  img: string;
  genres: Array<string>;
}

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  private artistsCache: { [key: string]: Artist } = {};

  constructor(private spotifyService: SpotifyService) {}

  /**
   * Retrieves the artist with the provided artist uri.
   * @param {string} artistLink - The uri of the artist to retrieve
   * @returns An Observable containing an Artist object
   */
  public getArtist(artistLink: string): Observable<Artist> {
    if (this.artistsCache[artistLink] != undefined) {
      return of(this.artistsCache[artistLink]);
    }

    return this.spotifyService.getArtist(artistLink).pipe(
      map((artist: IArtistDTO) => {
        const ret = {
          id: artist.id,
          link: artist.href,
          name: artist.name,
          img: artist.images[0]?.url,
          genres: artist.genres,
        };

        this.artistsCache[artistLink] = ret;
        return ret;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves the artists with the provided artist ids.
   * @param {Array<string>} ids - A list of artist ids
   * @returns A list of Artist objects
   */
  public getSeveralArtists(ids: Array<string>): Observable<Array<Artist>> {
    let idStrings: Array<string> = [];
    for (let i = 0; i < Math.ceil(ids.length / 50); i++) {
      idStrings.push(ids.slice(i * 50, (i + 1) * 50 - 1).join(","));
    }

    return forkJoin(idStrings.map((idString) => this.spotifyService.getSeveralArtists(idString))).pipe(
      map((response) => ([] as IArtistDTO[]).concat(...response)),
      map((artists: Array<IArtistDTO>) => {
        return artists.map((artist) => {
          return {
            id: artist.id,
            link: artist.href,
            name: artist.name,
            img: artist.images[0]?.url,
            genres: artist.genres,
          };
        });
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Determines whether or not the provided artists match.
   * @param {Artist} artist1 - The first artist to compare
   * @param {Artist} artist2 - The second artist to compare
   */
  public equal(artist1: Artist, artist2: Artist) {
    return artist1 && artist2 ? artist1.name == artist2.name : false;
  }

  /**
   * Determines whether or not the provided array contains an artist.
   * @param {Artist} artistList - A list of artists to search
   * @param {Artist} artist - The artist to find
   */
  public contains(artistList: Array<Artist>, artist: Artist): boolean {
    return artistList.some((a) => this.equal(a, artist));
  }
}
