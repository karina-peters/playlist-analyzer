import { Component, OnInit } from "@angular/core";
import { Playlist } from "../../base/playlist-select/playlist-select.component";
import { SpotifyService } from "src/app/services/spotify.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-distribute-tracks",
  templateUrl: "./distribute-tracks.component.html",
  styleUrls: ["./distribute-tracks.component.scss"],
})
export class TrackDistributeComponent implements OnInit {
  public playlist: Playlist;

  constructor(private spotifyService: SpotifyService, private router: Router) {
    this.playlist = { id: -1, name: "", tracksLink: "", tracks: [] };
  }

  ngOnInit(): void {
    if (!this.spotifyService.getToken()) {
      let params = window.location.hash.split("&");
      this.spotifyService.setToken(params[0].split("=")[1]);
    }

    this.router.navigateByUrl("/design-distribute-tracks");
    this.spotifyService.getPlaylists();
  }

  selectPlaylist(playlist: Playlist) {
    this.playlist = playlist;
    console.log("playlist id", playlist.id);
  }

  handleAuthError(error: HttpErrorResponse) {
    // alert('oops! you are not signed in');
    this.spotifyService.authenticate("design-distribute-tracks");
  }
}
