import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Track } from "src/app/services/track.service";
import { Size, TrackListConfig } from "../track-list/track-list.component";

@Component({
  selector: "app-track",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.scss"],
})
export class TrackComponent implements OnInit {
  @Input() trackData = {
    index: -1,
    id: "",
    name: "",
    artist: { id: "", link: "", name: "", img: "", genres: [] as Array<string> },
    album: "",
    duration: "",
    img: "",
    playlists: [] as Array<string>,
    liked: false,
    checked: false,
  };
  @Input() selectedIndex$: BehaviorSubject<number> = new BehaviorSubject(-1);
  @Input() config: TrackListConfig;

  @Output() selectedEvent = new EventEmitter<Track>();

  public showCheck: boolean = false;
  public selected: boolean = false;

  constructor() {
    this.config = {
      size: Size.Small,
      readonly: true,
      showLike: false,
      showCheck: false,
    };
  }

  ngOnInit(): void {
    this.selectedIndex$.subscribe((index) => {
      if (!this.config.readonly) {
        this.selected = index == this.trackData.index;
      }
    });
  }

  public select() {
    if (!this.config.readonly) {
      this.selectedEvent.emit(this.trackData);
    }
  }

  public handleCheck($event: Event) {
    if (!this.config.readonly) {
      this.trackData.checked = !this.trackData.checked;

      // Don't select track on check
      $event.stopPropagation();
    }
  }

  public handleLike($event: Event) {
    if (!this.config.readonly) {
      this.trackData.liked = !this.trackData.liked;

      // Don't select track on like
      $event.stopPropagation();
    }
  }
}
