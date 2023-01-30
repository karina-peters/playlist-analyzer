import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Track } from "src/app/services/track.service";
import { DataType, SelectorConfig } from "src/app/components/base/selector/selector.component";
import { Playlist, PlaylistService } from "src/app/services/playlist.service";

@Component({
  selector: "app-track-distribution",
  templateUrl: "./track-distribution.component.html",
  styleUrls: ["./track-distribution.component.scss"],
})
export class TrackDistributionComponent implements OnInit {
  public selectorConfig: SelectorConfig;
  public selectorOptions$: BehaviorSubject<Array<Track>> = new BehaviorSubject<Array<Track>>([]);

  public trackPlaylists: Array<Playlist> = [];

  private playlists: Array<Playlist> = [];
  private track: Track;

  constructor(private playlistService: PlaylistService) {
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
      placeholder: "Search for a Track",
      type: DataType.Track,
      allowSearch: true,
      searchFirst: true,
    };
  }

  ngOnInit(): void {
    this.playlistService.getDetailedUserPlaylists().subscribe((playlists: Array<Playlist>) => {
      this.playlists = playlists;
    });
  }

  public select(track: Track) {
    this.track = track;
    this.trackPlaylists = this.playlists.filter((playlist) => this.playlistService.containsTrack(playlist, this.track));
  }
}
