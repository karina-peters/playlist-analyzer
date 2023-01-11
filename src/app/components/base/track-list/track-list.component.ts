import { Component, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { Track } from "src/app/services/track.service";

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.scss"],
})
export class TrackListComponent implements OnInit {
  @Input() tracks$: Subject<Array<Track>> = new Subject<Array<Track>>();

  public tracks: Array<Track> = [];

  constructor() {}

  ngOnInit(): void {
    this.tracks$.subscribe((tracks: Array<Track>) => {
      this.tracks = tracks;
    });
  }
}
