import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-tag-cloud",
  templateUrl: "./tag-cloud.component.html",
  styleUrls: ["./tag-cloud.component.scss"],
})
export class TagCloudComponent implements OnInit {
  @Input() tags: Array<string> = [];

  public visibleTags: Array<string> = [];
  public allVisible: boolean = true;

  math = Math;

  constructor() {}

  ngOnInit(): void {
    if (this.tags.length > 15) {
      this.visibleTags = this.tags.slice(0, 15);
      this.allVisible = false;
    } else {
      this.visibleTags = this.tags;
    }
  }

  public toggleShow() {
    if (!this.allVisible) {
      this.visibleTags = this.tags;
      this.allVisible = true;
    } else {
      this.visibleTags = this.tags.slice(0, 15);
      this.allVisible = false;
    }
  }
}
