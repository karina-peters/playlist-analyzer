import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";
import { Track, TrackService } from "./track.service";
import { IPlaylistsDTO } from "src/app/models/spotify-response.models";

export interface Playlist {
  index: number;
  id: string;
  name: string;
  tracksLink: string;
  tracks: Array<Track>;
  tracksCount: number;
  owner: string;
  description?: string;
  img?: string;
  selected?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  constructor(private spotifyService: SpotifyService, private trackService: TrackService) {}

  /**
   * Retrieves the playlists for the current user.
   * @returns An Observable containing an Array of Playlist objects
   */
  public getUserPlaylists(): Observable<Array<Playlist>> {
    return this.spotifyService.getPlaylists().pipe(
      map((playlists: Array<IPlaylistsDTO>) => {
        return playlists.map((playlist, index) => {
          return {
            index: index,
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            tracks: [],
            tracksLink: playlist.tracks.href,
            tracksCount: playlist.tracks.total,
            img: playlist.images[0]?.url,
            owner: playlist.owner.id,
            selected: false,
          };
        });
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  public getDetailedUserPlaylists(): Observable<Array<Playlist>> {
    return this.getUserPlaylists().pipe(
      mergeMap((playlists: Array<Playlist>) =>
        forkJoin(
          playlists.map((playlist: Playlist) =>
            this.trackService.getTracksArtists(playlist.tracksLink).pipe(
              map((tracks: Array<Track>) => {
                playlist.tracks = tracks;
                return playlist;
              })
            )
          )
        )
      ),
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
