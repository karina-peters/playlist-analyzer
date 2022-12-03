import { Component, OnInit } from "@angular/core";
import { Playlist } from "src/app/services/playlist.service";
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

  ngOnInit(): void {}

  selectPlaylist(playlist: Playlist) {
    this.playlist = playlist;
  }

  handleAuthError(error: HttpErrorResponse) {
    // this.spotifyService.authenticateTake2("design-distribute-tracks");
  }
}
