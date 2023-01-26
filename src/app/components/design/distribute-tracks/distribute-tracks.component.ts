import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Playlist } from "src/app/services/playlist.service";
import { PlaylistService } from "src/app/services/playlist.service";
import { DataType, SelectorConfig } from "src/app/components/base/selector/selector.component";
import { TrackService, Track } from "src/app/services/track.service";

@Component({
  selector: "app-distribute-tracks",
  templateUrl: "./distribute-tracks.component.html",
  styleUrls: ["./distribute-tracks.component.scss"],
})
export class TrackDistributeComponent implements OnInit {
  public selectorConfig: SelectorConfig;
  public selectorOptions$: BehaviorSubject<Array<Playlist>> = new BehaviorSubject<Array<Playlist>>([]);
  public tracks$: BehaviorSubject<Array<Track>> = new BehaviorSubject<Array<Track>>([]);

  public playlist: Playlist;

  constructor(private playlistService: PlaylistService, private trackService: TrackService) {
    this.playlist = { index: -1, id: "", name: "", tracksLink: "", tracks: [], tracksCount: 0 };

    this.selectorConfig = {
      type: DataType.Playlist,
      allowSearch: true,
    };
  }

  ngOnInit(): void {
    this.playlistService.getUserPlaylists().subscribe((playlists: Array<Playlist>) => {
      this.selectorOptions$.next(playlists);
    });
  }

  public selectPlaylist(playlist: Playlist) {
    this.playlist = playlist;
    this.trackService.getTracks(playlist.tracksLink).subscribe((tracks) => {
      this.playlist.tracks = tracks;
      this.tracks$.next(tracks);
    });
  }
}
