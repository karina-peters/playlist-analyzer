import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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
  constructor(private spotifyService: SpotifyService) {}

  /**
   * Retrieves the artists with the provided artist ids.
   * @param {Array<string>} ids - A list of artist ids
   * @returns A list of Artist objects
   */
  public getSeveralArtists(ids: Array<string>): Observable<Array<Artist>> {
    return this.spotifyService.getSeveralArtists(ids).pipe(
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
    return artist1 && artist2 ? artist1.id == artist2.id : false;
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
