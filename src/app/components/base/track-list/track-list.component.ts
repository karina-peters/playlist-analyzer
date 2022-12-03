import { Component, Input, OnInit } from "@angular/core";
import { Playlist } from "src/app/services/playlist.service";
import { Track, TrackService } from "src/app/services/track.service";

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.scss"],
})
export class TrackListComponent implements OnInit {
  @Input() playlist: Playlist = {
    id: -1,
    name: "",
    tracksLink: "",
    tracks: [],
  };

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.trackService
      .getTracks(this.playlist.tracksLink)
      .subscribe((tracks: Array<Track>) => (this.playlist.tracks = tracks));
  }
}
