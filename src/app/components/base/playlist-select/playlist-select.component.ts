import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Playlist } from "src/app/services/playlist.service";

@Component({
  selector: "app-playlist-select",
  templateUrl: "./playlist-select.component.html",
  styleUrls: ["./playlist-select.component.scss"],
})
export class PlaylistSelectComponent implements OnInit {
  public selectedPlaylist: Playlist;
  public showOptions: boolean = false;
  public selectText: string = "Choose a Playlist";

  @Input() type = "";
  @Input() playlists: Array<Playlist> = [];
  @Output() selectedEvent = new EventEmitter<Playlist>();
  @Output() authError = new EventEmitter<HttpErrorResponse>();

  constructor() {
    this.selectedPlaylist = {
      index: -1,
      id: "",
      name: "",
      tracksLink: "",
      tracks: [],
    };
  }

  ngOnInit(): void {}

  /**
   * Updates the selector text and emits the selected playlist id.
   * @param index - The index of the selected playlist
   */
  public selectPlaylist(index: number): void {
    this.selectText = this.playlists[index].name;
    this.selectedPlaylist = this.playlists[index];

    this.selectedEvent.emit(this.playlists[index]);
    this.showOptions = false;
  }
}
