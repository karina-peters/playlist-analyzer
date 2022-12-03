import { Injectable } from "@angular/core";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";
import { Track, TrackService } from "./track.service";

export interface Playlist {
  id: number;
  name: string;
  tracksLink: string;
  tracks: Array<Track>;
  description?: string;
}

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  constructor(
    private spotifyService: SpotifyService,
    private trackService: TrackService
  ) {}

  public getPlaylists(track?: Track): Observable<Array<Playlist>> {
    return this.spotifyService.getPlaylists().pipe(
      map((playlists) =>
        playlists.map((playlist, index) => {
          return {
            id: index,
            name: playlist.name,
            description: playlist.description,
            tracks: [],
            tracksLink: playlist.tracks.href,
          };
        })
      ),
      mergeMap((playlists: Array<Playlist>) =>
        forkJoin(
          playlists.map((playlist: Playlist) =>
            this.trackService.getTracks(playlist.tracksLink).pipe(
              map((tracks: Array<Track>) => {
                playlist.tracks = tracks;
                return playlist;
              })
            )
          )
        )
      ),
      map((playlists: Array<Playlist>) =>
        playlists.filter(
          (playlist: Playlist) => !track || this.containsTrack(playlist, track)
        )
      ),
      catchError((error) => {
        throw error;
      })
    );
  }

  public containsTrack(playlist: Playlist, trackFind: Track): boolean {
    if (!playlist || !trackFind) {
      return false;
    }

    return (
      playlist.tracks.filter((track: Track) =>
        this.trackService.tracksEqual(track, trackFind)
      ).length > 0
    );
  }
}
