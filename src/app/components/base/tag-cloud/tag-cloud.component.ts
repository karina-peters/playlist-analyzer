import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-tag-cloud",
  templateUrl: "./tag-cloud.component.html",
  styleUrls: ["./tag-cloud.component.scss"],
})
export class TagCloudComponent implements OnInit {
  @Input() tags: Array<string> = [];

  math = Math;

  constructor() {}

  ngOnInit(): void {}
}
