import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Track } from "src/app/services/track.service";
export interface TrackListConfig {
  size: Size;
  readonly: boolean;
  showLike: boolean;
  showCheck: boolean;
}

export enum Size {
  Small,
  Medium,
  Large,
}
@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.scss"],
})
export class TrackListComponent implements OnInit {
  @Input() public tracks: Array<Track> = [];
  @Input() public checkedTracks: Array<string> = [];
  @Input() public config: TrackListConfig = { size: Size.Small, readonly: true, showLike: false, showCheck: false };

  @Output() selectedEvent = new EventEmitter<Track>();

  public selectedIndex$: BehaviorSubject<number> = new BehaviorSubject(-1);

  constructor() {}

  ngOnInit(): void {}

  public setSelected(track: Track) {
    this.selectedIndex$.next(track.index);
    this.selectedEvent.emit(track);
  }
}
