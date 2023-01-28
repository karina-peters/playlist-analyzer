import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Playlist } from "src/app/services/playlist.service";

@Component({
  selector: "app-playlist-list",
  templateUrl: "./playlist-list.component.html",
  styleUrls: ["./playlist-list.component.scss"],
})
export class PlaylistListComponent implements OnInit {
  @Input() playlists: Array<Playlist> = [];

  @Output() selectedEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  public selectPlaylist(playlist: Playlist) {
    this.playlists[playlist.index].selected = !this.playlists[playlist.index].selected;
    this.selectedEvent.emit(playlist.id);
  }
}
