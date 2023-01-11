import { Component, Input, OnInit } from "@angular/core";

export interface Page {
  index: number;
  items: Array<any>;
}

@Component({
  selector: "app-image-scroll",
  templateUrl: "./image-scroll.component.html",
  styleUrls: ["./image-scroll.component.scss"],
})
export class ImageScrollComponent implements OnInit {
  @Input() items: Array<any> = [];
  @Input() itemsPerPage: number = 5;

  public currentPage = 0;
  public pages: Array<Page> = [];
  public imageSize: string = "200px";

  constructor() {}

  ngOnInit(): void {
    let page = 0;
    while (page < Math.ceil(this.items.length / this.itemsPerPage)) {
      this.pages[page] = {
        index: page,
        items: this.items.slice(page * this.itemsPerPage, page * this.itemsPerPage + this.itemsPerPage),
      };

      page++;
    }

    this.imageSize = `${(1 / this.itemsPerPage) * 1000}px`;
  }

  public onNextPage(direction: string) {
    direction == "right" ? this.currentPage++ : this.currentPage--;
    let index = direction == "right" ? this.items.length - 1 : 0;

    let items = document.querySelectorAll(`.item`)[index];
    items &&
      items.scrollIntoView({
        behavior: "smooth",
        inline: direction == "right" ? "start" : "end",
      });
  }
}
