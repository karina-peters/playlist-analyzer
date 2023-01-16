import { Component, OnInit } from "@angular/core";
import { UserService, User } from "src/app/services/user.service";

@Component({
  selector: "app-nav-header",
  templateUrl: "./nav-header.component.html",
  styleUrls: ["./nav-header.component.scss"],
})
export class NavHeaderComponent implements OnInit {
  public user: User = {
    id: "",
    name: "",
    img: "",
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }
}
