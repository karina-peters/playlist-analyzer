import { Component, OnInit } from "@angular/core";
import { Playlist } from "src/app/services/playlist.service";
import { Track, TrackService } from "src/app/services/track.service";
import { Artist, ArtistService } from "src/app/services/artist.service";
import { PlaylistService } from "src/app/services/playlist.service";
import { forkJoin, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: "app-playlist-similarity",
  templateUrl: "./playlist-similarity.component.html",
  styleUrls: ["./playlist-similarity.component.scss"],
})
export class PlaylistSimilarityComponent implements OnInit {
  public leftPlaylist: Playlist;
  public rightPlaylist: Playlist;
  public playlists: Array<Playlist> = [];

  public commonTracks: Array<Track> = [];
  public commonArtists: Array<Artist> = [];
  public commonGenres: Array<string> = [];

  public showStats: boolean = false;
  public percentSimilar: number = 0;

  constructor(
    private alertService: AlertService,
    private artistService: ArtistService,
    private playlistService: PlaylistService,
    private trackService: TrackService
  ) {
    this.leftPlaylist = { id: -1, name: "", tracksLink: "", tracks: [] };
    this.rightPlaylist = { id: -1, name: "", tracksLink: "", tracks: [] };
  }

  ngOnInit(): void {
    this.playlistService.getPlaylists().subscribe((playlists: Array<Playlist>) => (this.playlists = playlists));
  }

  public comparePlaylists(_event: Event) {
    if (!this.leftPlaylist?.tracks || !this.rightPlaylist?.tracks) {
      // TODO: maybe subscribe to alert and close it when a new playlist is selected?
      this.alertService.error("Error: one or more of the selected playlists has no tracks!");
      return;
    }

    let commonTracks: Array<Track> = [];
    let commonArtists: Array<Artist> = [];

    let artists: [Array<Artist>, Array<Artist>] = [[], []];

    this.leftPlaylist.tracks.forEach((ltrack) => {
      if (!this.artistService.contains(artists[0], ltrack.artist)) {
        artists[0].push(ltrack.artist);
      }

      this.rightPlaylist.tracks.forEach((rtrack) => {
        if (!this.artistService.contains(artists[1], rtrack.artist)) {
          artists[1].push(rtrack.artist);
        }

        if (this.trackService.equal(ltrack, rtrack) && !this.trackService.contains(commonTracks, ltrack)) {
          commonTracks.push(ltrack);
        }

        if (this.artistService.equal(ltrack.artist, rtrack.artist) && !this.artistService.contains(commonArtists, ltrack.artist)) {
          commonArtists.push(ltrack.artist);
        }
      });
    });

    // TODO: add commonGenres
    this.commonTracks = commonTracks;
    this.commonArtists = commonArtists;

    this.generateStats(artists[0].length, artists[1].length);
  }

  public selectLeft(playlist: Playlist) {
    this.leftPlaylist = playlist;
    this.showStats = false;
  }

  public selectRight(playlist: Playlist) {
    this.rightPlaylist = playlist;
    this.showStats = false;
  }

  private generateStats(aArtistCount: number, bArtistCount: number): void {
    this.percentSimilar = this.calculateSimilarity(
      this.leftPlaylist.tracks.length,
      this.rightPlaylist.tracks.length,
      this.commonTracks.length,
      aArtistCount,
      bArtistCount,
      this.commonArtists.length
    );

    this.getCommonArtists().subscribe(() => {
      this.showStats = true;

      let element = document.getElementById("playlist-similarity");
      if (element) {
        element.scrollTop = element.scrollHeight - element.clientHeight;
      }
    });
  }

  private getCommonArtists(): Observable<any> {
    let observables: Array<Observable<Artist>> = [];
    for (const artist of this.commonArtists) {
      observables.push(this.artistService.getArtist(artist.link));
    }

    return forkJoin(observables).pipe(
      map((artists) => {
        for (const index in this.commonArtists) {
          this.commonArtists[index] = artists[index];
        }
      })
    );
  }

  private calculateSimilarity(
    aTrackCount: number,
    bTrackCount: number,
    commonTrackCount: number,
    aArtistCount: number,
    bArtistCount: number,
    commonArtistCount: number
  ): number {
    const unionTracks = aTrackCount + bTrackCount - commonTrackCount;
    const unionArtists = aArtistCount + bArtistCount - commonArtistCount;

    return Math.floor(((commonTrackCount + commonArtistCount) / (unionTracks + unionArtists)) * 100);
  }
}
