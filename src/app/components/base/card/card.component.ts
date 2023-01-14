import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements OnInit {
  @Input() image: string | undefined = "";
  @Input() title: string = "Playlist Name #1";
  @Input() description: string = "";
  @Input() footer: string = "";

  constructor() {}

  ngOnInit(): void {}
}
