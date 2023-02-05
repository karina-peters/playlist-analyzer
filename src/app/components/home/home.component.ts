import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { PlaylistService } from "src/app/services/playlist.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private playlistService: PlaylistService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Use token from url, then remove
    if (window.location.search) {
      this.authService.requestToken(window.location.search).subscribe(() => {
        this.userService.signIn();
        this.router.navigateByUrl("/home");
      });
    }

    // Cache playlist data
    this.playlistService.getDetailedUserPlaylists().subscribe();
  }
}
