import { Component, Input, OnInit } from "@angular/core";
import { Artist } from "src/app/services/artist.service";

@Component({
  selector: "app-card-group",
  templateUrl: "./card-group.component.html",
  styleUrls: ["./card-group.component.scss"],
})
export class CardGroupComponent implements OnInit {
  @Input() items: Array<Artist> = [];

  constructor() {}

  ngOnInit(): void {}
}
