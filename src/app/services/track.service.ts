import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";
import { Artist, ArtistService } from "./artist.service";
import { IPlaylistTrackDTO, ISearchResultsDTO } from "src/app/models/spotify-response.models";

export class Track {
  index: number = -1;
  id: string = "default-id";
  name: string = "";
  artist: Artist = new Artist();
  album: string = "";
  duration: string = "";
  img: string = "";
  playlists: Array<string> = [];
  liked: boolean = false;
  checked: boolean = false;

  constructor(init?: Partial<Track>) {
    Object.assign(this, init);
  }
}

@Injectable({
  providedIn: "root",
})
export class TrackService {
  constructor(private spotifyService: SpotifyService, private artistService: ArtistService) {}

  /**
   * Retrieves a list of tracks for the provided tracks uri.
   * @param {string} id - The id of the playlist tracks to retrieve
   * @returns An Observable containing an array of Track objects
   */
  public getPlaylistTracks(id: string): Observable<Array<Track>> {
    return this.spotifyService.getPlaylistItems(id).pipe(
      map((tracks: Array<IPlaylistTrackDTO>) => {
        return tracks.map((track, index) => {
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
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Retrieves a list of tracks and their artist details for the provided tracks uri.
   * @param {string} id - The id of the playlist tracks to retrieve
   * @returns An Observable containing an array of Track objects
   */
  public getPlaylistTracksDetailed(id: string): Observable<Array<Track>> {
    let tracks: Array<Track> = [];
    return this.getPlaylistTracks(id).pipe(
      // Get detailed artist info
      mergeMap((tracksArray: Array<Track>) => {
        tracks = tracksArray;
        return this.artistService.getSeveralArtists(tracksArray.map((track) => track.artist.id));
      }),
      map((artists: Array<Artist>) => {
        return tracks.map((track, index) => {
          if (artists[index]) {
            let foundArtist = artists.find((artist) => track.artist.id == artist.id);
            track.artist = foundArtist != undefined ? foundArtist : track.artist;
          }

          return track;
        });
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
    return this.spotifyService.getSearchResults(query, type).pipe(
      map((results: ISearchResultsDTO) => {
        return results.tracks?.items.map((track, index) => {
          return {
            index: index,
            id: track.id,
            name: track.name,
            artist: {
              id: track.artists[0]?.id,
              link: track.artists[0]?.href,
              name: track.artists[0]?.name,
              img: "",
              genres: [],
            },
            album: track.album?.name,
            duration: this.convertTime(track.duration_ms),
            img: track.album?.images[0]?.url,
            playlists: [],
            liked: false,
            checked: false,
          };
        });
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
    return this.spotifyService.checkSavedTracks(ids).pipe(
      map((response) => response),
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
    return track1 && track2
      ? track1.name == track2.name && track1.album == track2.album && this.artistService.equal(track1.artist, track2.artist)
      : false;
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
