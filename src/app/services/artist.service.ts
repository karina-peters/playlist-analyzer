import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";

export interface Artist {
  link: string;
  name: string;
  img: string;
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
    return this.spotifyService.getArtist(artistLink).pipe(
      map((artist) => {
        const ret = {
          link: artist.href,
          name: artist.name,
          img: artist.images[0].url,
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
