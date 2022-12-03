import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";

export interface Track {
  id: number;
  name: string;
  artist: string;
  album: string;
  duration: string;
  img: string;
}

@Injectable({
  providedIn: "root",
})
export class TrackService {
  constructor(private spotifyService: SpotifyService) {}

  public getTracks(tracksLink: string): Observable<Array<Track>> {
    return this.spotifyService.getTracks(tracksLink).pipe(
      map((tracks) =>
        tracks.map((track, index) => {
          return {
            id: index,
            name: track.track?.name,
            artist: track.track?.artists[0].name,
            album: track.track?.album,
            duration: this.convertTime(track.track?.duration_ms),
            img: track.track?.album.images[2].url,
          };
        })
      ),
      catchError((error) => {
        throw error;
      })
    );
  }

  public tracksEqual(track1: Track, track2: Track): boolean {
    return (
      track1.name == track2.name &&
      track1.artist == track2.artist &&
      track1.album == track2.album
    );
  }

  public convertTime(ms: string): string {
    const minutes = Math.floor(Number(ms) / 60000);
    const seconds = ((Number(ms) % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  }
}
