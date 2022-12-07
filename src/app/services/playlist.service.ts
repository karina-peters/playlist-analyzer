import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";
import { Track, TrackService } from "./track.service";
import { IPlaylistsDTO } from "src/app/models/spotify-response.models";

export interface Playlist {
  index: number;
  id: string;
  name: string;
  tracksLink: string;
  tracks: Array<Track>;
  description?: string;
}

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  private playlistCache: Array<Playlist> = [];

  constructor(private spotifyService: SpotifyService, private trackService: TrackService) {}

  /**
   * Retrieves the playlists for the current user.
   * @returns An Observable containing an Array of Playlist objects
   */
  public getPlaylists(): Observable<Array<Playlist>> {
    if (this.playlistCache.length > 0) {
      return of(this.playlistCache);
    }

    return this.spotifyService.getPlaylists().pipe(
      map((playlists: Array<IPlaylistsDTO>) => {
        const ret = playlists.map((playlist, index) => {
          return {
            index: index,
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            tracks: [],
            tracksLink: playlist.tracks.href,
          };
        });

        this.playlistCache = ret;
        return ret;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Determines whether or not the provided playlist contains a track.
   * @param {Playlist} playlist - A playlist to search
   * @param {Track} trackFind - The track to find
   */
  public containsTrack(playlist: Playlist, trackFind: Track): boolean {
    if (!playlist || !trackFind) {
      return false;
    }

    return playlist.tracks.filter((track: Track) => this.trackService.equal(track, trackFind)).length > 0;
  }
}

// mergeMap((playlists: Array<Playlist>) =>
//         forkJoin(
//           playlists.map((playlist: Playlist) =>
//             this.trackService.getTracks(playlist.tracksLink).pipe(
//               map((tracks: Array<Track>) => {
//                 playlist.tracks = tracks;
//                 return playlist;
//               })
//             )
//           )
//         )
//       ),
//       map((playlists: Array<Playlist>) =>
//         playlists.filter(
//           (playlist: Playlist) => !track || this.containsTrack(playlist, track)
//         )
//       ),
