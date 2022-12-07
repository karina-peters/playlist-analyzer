import { Component, OnInit, Input } from "@angular/core";

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
    artist: { link: "", name: "", img: "" },
    album: "",
    duration: "",
    img: "",
  };

  @Input() common: boolean = false;
  @Input() type: string = "";

  constructor() {}

  ngOnInit(): void {}
}
