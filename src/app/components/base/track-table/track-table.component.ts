import { Component, Input, OnInit } from "@angular/core";
import { Playlist } from "src/app/services/playlist.service";
import { Track, TrackService } from "src/app/services/track.service";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
})
export class TrackTableComponent implements OnInit {
  @Input() playlist: Playlist = {
    id: -1,
    name: "",
    tracksLink: "",
    tracks: [],
  };

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.trackService.getTracks(this.playlist.tracksLink).subscribe((tracks: Array<Track>) => (this.playlist.tracks = tracks));
  }
}
