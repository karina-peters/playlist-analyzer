import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";
import { Artist, ArtistService } from "./artist.service";
import { IPlaylistTracksDTO } from "src/app/models/spotify-response.models";

export interface Track {
  index: number;
  id: string;
  name: string;
  artist: Artist;
  album: string;
  duration: string;
  img: string;
}

@Injectable({
  providedIn: "root",
})
export class TrackService {
  private tracksCache: { [key: string]: Array<Track> } = {};

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
            img: track.track?.album.images[2].url,
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
