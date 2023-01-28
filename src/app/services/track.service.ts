import { Injectable } from "@angular/core";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, map, mergeMap, reduce } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";
import { Artist, ArtistService } from "./artist.service";
import { IPlaylistTracksDTO, ISearchResultsDTO } from "src/app/models/spotify-response.models";

export interface Track {
  index: number;
  id: string;
  name: string;
  artist: Artist;
  album: string;
  duration: string;
  img: string;
  playlists: Array<string>;
  liked: boolean;
  checked: boolean;
}

@Injectable({
  providedIn: "root",
})
export class TrackService {
  private tracksCache: { [key: string]: Array<Track> } = {};
  private tracksArtistsCache: { [key: string]: Array<Track> } = {};
  private searchCache: { [key: string]: Array<Track> } = {};

  constructor(private spotifyService: SpotifyService, private artistService: ArtistService) {}

  /**
   * Retrieves a list of tracks for the provided tracks uri.
   * @param {string} tracksLink - The uri of the tracks to retrieve
   * @returns An Observable containing an array of Track objects
   */
  public getTracks(tracksLink: string): Observable<Array<Track>> {
    if (this.tracksCache[tracksLink] != undefined) {
      return of(this.tracksCache[tracksLink]);
    }

    return this.spotifyService.getTracks(tracksLink).pipe(
      map((tracks: Array<IPlaylistTracksDTO>) => {
        const ret = tracks.map((track, index) => {
          return {
            index: index,
            id: track.track?.id,
            name: track.track?.name,
            artist: {
              id: track.track?.artists[0].id,
              link: track.track?.artists[0].href,
              name: track.track?.artists[0].name,
              img: "",
              genres: [],
            },
            album: track.track?.album.name,
            duration: this.convertTime(track.track?.duration_ms),
            img: track.track?.album.images[0].url,
            playlists: [],
            liked: false,
            checked: false,
          };
        });

        this.tracksCache[tracksLink] = ret;
        return ret;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves a list of tracks and their artist details for the provided tracks uri.
   * @param {string} tracksLink - The uri of the tracks to retrieve
   * @returns An Observable containing an array of Track objects
   */
  public getTracksArtists(tracksLink: string): Observable<Array<Track>> {
    if (this.tracksArtistsCache[tracksLink] != undefined) {
      return of(this.tracksArtistsCache[tracksLink]);
    }

    return this.getTracks(tracksLink).pipe(
      // Get detailed artist info
      mergeMap((tracks: Array<Track>) =>
        forkJoin(
          tracks.map((track: Track) =>
            this.artistService.getArtist(track.artist.link).pipe(
              map((artist: Artist) => {
                track.artist = artist;
                return track;
              })
            )
          )
        )
      ),
      map((tracks: Array<Track>) => {
        this.tracksArtistsCache[tracksLink] = tracks;
        return tracks;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves a list of tracks that match the given search query.
   * @param {string} query - The search query from the user
   * @param {string} type - A comma-separated list of item types to search across
   * @returns An Observable containing an array of Track objects
   */
  public searchTracks(query: string, type: string): Observable<Array<Track>> {
    if (this.searchCache[query] != undefined) {
      return of(this.searchCache[query]);
    }

    return this.spotifyService.getSearchResults(query, type).pipe(
      map((results: ISearchResultsDTO) => {
        const ret = results.tracks?.items.map((track, index) => {
          return {
            index: index,
            id: track.id,
            name: track.name,
            artist: {
              id: track.artists[0].id,
              link: track.artists[0].href,
              name: track.artists[0].name,
              img: "",
              genres: [],
            },
            album: track.album.name,
            duration: this.convertTime(track.duration_ms),
            img: track.album.images[0].url,
            playlists: [],
            liked: false,
            checked: false,
          };
        });

        this.searchCache[query] = ret;
        return ret;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Checks whether the given track(s) are saved to the user's library.
   * @param {Array<string>} ids - A list of track ids
   * @returns A list of booleans
   */
  public checkSavedTracks(ids: Array<string>): Observable<Array<boolean>> {
    let idStrings: Array<string> = [];
    for (let i = 0; i < Math.ceil(ids.length / 50); i++) {
      idStrings.push(ids.slice(i * 50, (i + 1) * 50 - 1).join(","));
    }

    return forkJoin(idStrings.map((idString) => this.spotifyService.checkSavedTracks(idString))).pipe(
      map((response) => ([] as boolean[]).concat(...response)),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Determines whether or not the provided tracks match.
   * @param {Track} track1 - The first track to compare
   * @param {Track} track2 - The second track to compare
   */
  public equal(track1: Track, track2: Track): boolean {
    return track1.name == track2.name && track1.album == track2.album && this.artistService.equal(track1.artist, track2.artist);
  }

  /**
   * Determines whether or not the provided array contains a track.
   * @param {Track} trackList - A list of tracks to search
   * @param {Track} track - The track to find
   */
  public contains(trackList: Array<Track>, track: Track): boolean {
    return trackList.some((t) => this.equal(t, track));
  }

  private convertTime(ms: number): string {
    const minutes = Math.floor(Number(ms) / 60000);
    const seconds = ((Number(ms) % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  }
}
