import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-track",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.scss"],
})
export class TrackComponent implements OnInit {
  @Input() trackData = {
    id: 0,
    name: "",
    artist: "",
    album: "",
    duration: "",
    img: "",
  };

  @Input() common: boolean = false;
  @Input() type: string = "";

  constructor() {}

  ngOnInit(): void {}
}
