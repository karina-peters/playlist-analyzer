import { Component, Input, OnInit } from "@angular/core";
import { SpotifyService } from "src/app/services/spotify.service";
import { Playlist } from "../playlist-select/playlist-select.component";

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.scss"],
})
export class TrackListComponent implements OnInit {
  @Input() playlist: Playlist = {
    id: -1,
    name: "",
    tracksLink: "",
    tracks: [],
  };

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.getTracks();
  }

  getTracks(): void {
    this.spotifyService
      .getTracks(this.playlist.tracksLink)
      .subscribe((response: any) => {
        this.playlist.tracks = [];

        response.items.forEach((track: any, index: number) => {
          this.playlist.tracks.push({
            id: index,
            name: track.track.name,
            artist: track.track.artists[0].name,
            album: track.track.album,
            duration: this.convertTime(track.track.duration_ms),
            img: track.track.album.images[2].url,
          });
        });
      });
  }

  convertTime(ms: string): string {
    const minutes = Math.floor(Number(ms) / 60000);
    const seconds = ((Number(ms) % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  }
}
