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
  public selectorConfig: SelectorConfig;
  public selectorOptions$: BehaviorSubject<Array<Playlist>> = new BehaviorSubject<Array<Playlist>>([]);

  public trackListConfig: TrackListConfig;

  public allPlaylists: Array<Playlist> = [];
  public savedTracks: Array<boolean> = [];

  public tracksToMap: { [index: string]: Array<string> } = {};
  public tracksToSave: Array<string> = [];

  public playlist: Playlist;
  public track: Track;

  constructor(private playlistService: PlaylistService, private trackService: TrackService) {
    this.playlist = { index: -1, id: "", name: "", tracksLink: "", tracks: [], tracksCount: 0, owner: "" };
    this.track = {
      index: -1,
      id: "",
      name: "",
      artist: { id: "", link: "", name: "", img: "", genres: [] },
      album: "",
      duration: "",
      img: "",
      playlists: [],
      liked: false,
      checked: false,
    };

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
    this.playlistService.getUserPlaylists().subscribe((playlists: Array<Playlist>) => {
      this.allPlaylists = playlists;
      this.selectorOptions$.next(playlists);
    });
  }

  public selectPlaylist(playlist: Playlist) {
    this.playlist = playlist;
    this.resetTrack();

    this.trackService
      .getTracks(playlist.tracksLink)
      .pipe(
        mergeMap((tracks) => {
          this.playlist.tracks = tracks;
          return this.trackService.checkSavedTracks(tracks.map((track) => track.id));
        })
      )
      .subscribe((saved: any) => {
        this.playlist.tracks.map((track) => {
          track.liked = saved[track.index];
        });
      });
  }

  public selectTrack(track: Track) {
    this.track = track;
    this.allPlaylists.map((playlist) => {
      // TODO: set selected to true for playlists it's already on
      playlist.selected = this.tracksToMap[this.track.id]?.includes(playlist.id) ? true : false;
    });
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
    this.track = {
      index: -1,
      id: "",
      name: "",
      artist: { id: "", link: "", name: "", img: "", genres: [] },
      album: "",
      duration: "",
      img: "",
      playlists: [],
      liked: false,
      checked: false,
    };
  }
}
