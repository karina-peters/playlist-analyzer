import { Component, OnInit } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { BehaviorSubject } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Playlist } from "src/app/services/playlist.service";
import { PlaylistService } from "src/app/services/playlist.service";
import { DataType, SelectorConfig } from "src/app/components/base/selector/selector.component";
import { TrackService, Track } from "src/app/services/track.service";
import { Size, TrackListConfig } from "../../base/track-list/track-list.component";

@Component({
  selector: "app-distribute-tracks",
  templateUrl: "./distribute-tracks.component.html",
  styleUrls: ["./distribute-tracks.component.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(100px)" }),
        animate("400ms", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("100ms", style({ opacity: 0, transform: "translateY(300px)" }))]),
    ]),
  ],
})
export class TrackDistributeComponent implements OnInit {
  public selectorLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public selectorConfig: SelectorConfig;
  public selectorOptions$: BehaviorSubject<Array<Playlist>> = new BehaviorSubject<Array<Playlist>>([]);

  public trackListConfig: TrackListConfig;

  public allPlaylists: Array<Playlist> = [];
  public savedTracks: Array<boolean> = [];

  public tracksToMap: { [index: string]: Array<string> } = {};
  public tracksToSave: Array<string> = [];

  public playlist: Playlist;
  public track: Track;
  public playlistCount: number = 0;

  constructor(private playlistService: PlaylistService, private trackService: TrackService) {
    this.playlist = new Playlist();
    this.track = new Track();

    this.selectorConfig = {
      type: DataType.Playlist,
      allowSearch: true,
    };

    this.trackListConfig = {
      size: Size.Medium,
      readonly: false,
      showLike: true,
      showCheck: true,
    };
  }

  ngOnInit(): void {
    this.playlistService.getDetailedUserPlaylists().subscribe((playlists: Array<Playlist>) => {
      this.allPlaylists = playlists;
      this.selectorLoading$.next(false);
      this.selectorOptions$.next(playlists);
    });
  }

  public selectPlaylist(playlist: Playlist) {
    this.playlist = playlist;
    this.resetTrack();

    this.trackService
      .getPlaylistTracks(playlist.id)
      .pipe(
        mergeMap((tracks) => {
          this.playlist.tracks = tracks;
          return this.trackService.checkSavedTracks(tracks.map((track) => track.id));
        })
      )
      .subscribe((saved: any) => {
        this.playlist.tracks.map((track) => {
          track.liked = saved[track.index];
          track.checked = this.allPlaylists.some((p) => p.name != this.playlist.name && p.tracks.some((t) => t.id == track.id));
        });
      });
  }

  public selectTrack(track: Track) {
    let count = 0;
    this.track = track;

    // Check all previously selected playlists and playlists the track is already on
    this.allPlaylists.map((playlist) => {
      let condition =
        this.tracksToMap[this.track.id]?.includes(playlist.id) || playlist.tracks.findIndex((track) => track.id == this.track.id) != -1;
      playlist.selected = condition ? true : false;
      if (condition) ++count;
    });

    this.playlistCount = count;
  }

  public setMappedPlaylists(id: string) {
    if (this.tracksToMap.hasOwnProperty(this.track.id)) {
      let index = this.tracksToMap[this.track.id].indexOf(id);
      if (index != -1) {
        // Remove playlist if it's already in the list
        this.tracksToMap[this.track.id].splice(index, 1);
        if (this.tracksToMap[this.track.id].length == 0) {
          // Remove track from map if last playlist removed
          delete this.tracksToMap[this.track.id];
          this.track.checked = false;
        }
      } else {
        // Add playlist if it's not in the list
        this.tracksToMap[this.track.id].push(id);
      }
    } else {
      // Add track to map
      this.tracksToMap[this.track.id] = [id];
      this.track.checked = true;
    }
  }

  public getKeys(obj: Object): Array<string> {
    return Object.keys(obj);
  }

  private resetTrack(): void {
    this.track = new Track();
  }
}
