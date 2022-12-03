import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Playlist, PlaylistService } from "src/app/services/playlist.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-playlist-select",
  templateUrl: "./playlist-select.component.html",
  styleUrls: ["./playlist-select.component.scss"],
})
export class PlaylistSelectComponent implements OnInit {
  public playlists: Array<Playlist>;
  public selectedPlaylist: Playlist = {
    id: -1,
    name: "",
    tracksLink: "",
    tracks: [],
  };
  public showOptions: boolean = false;
  public selectText: string = "Choose a Playlist";
  @Input() type = "";
  @Output() selectedEvent = new EventEmitter<Playlist>();
  @Output() authError = new EventEmitter<HttpErrorResponse>();

  constructor(private playlistService: PlaylistService) {
    this.playlists = [];
  }

  ngOnInit(): void {
    this.playlistService
      .getPlaylists()
      .subscribe((playlists: Array<Playlist>) => (this.playlists = playlists));
  }

  selectPlaylist(id: number) {
    this.selectText = this.playlists[id].name;
    this.selectedPlaylist = this.playlists[id];

    this.selectedEvent.emit(this.playlists[id]);
    this.showOptions = false;
  }
}
