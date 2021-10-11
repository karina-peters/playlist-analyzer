import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Track } from '../track/track.component'
import { SpotifyService } from 'src/app/services/spotify.service'

export interface Playlist {
  id: number,
  name: string,
  tracksLink: string,
  tracks: Array<Track>,
  description?: string,
}

@Component({
  selector: 'app-playlist-select',
  templateUrl: './playlist-select.component.html',
  styleUrls: ['./playlist-select.component.scss']
})
export class PlaylistSelectComponent implements OnInit {

  public playlists: Array<Playlist>;
  public selectedPlaylist: Playlist = { id: -1, name: '', tracksLink: '', tracks: [] };
  public showOptions: boolean = false;
  public selectText: string = "Choose a Playlist";
  @Output() selectedEvent = new EventEmitter<Playlist>();

  constructor(private spotifyService: SpotifyService) { 

    this.playlists = [];
  }

  ngOnInit(): void {
    this.spotifyService.getPlaylists().subscribe((response: any) => {
      response.items.forEach((playlist: any, index: number) => {
        this.playlists.push({
          id: index,
          name: playlist.name,
          description: playlist.description,
          tracks: [],
          tracksLink: playlist.tracks.href
        });
      });
    });
  }

  selectPlaylist(id: number) {
    console.log("selected: ", id);
    this.selectText = this.playlists[id].name;
    this.selectedPlaylist = this.playlists[id];

    this.selectedEvent.emit(this.playlists[id]);
    this.showOptions = false;

    this.getTracks();
    console.log('tracks', this.selectedPlaylist.tracks);
  }

  getTracks(): void {
    this.spotifyService.getTracks(this.selectedPlaylist.tracksLink).subscribe((response: any) => {
      console.log(response);
      response.items.forEach((track: any, index: number) => {
        this.selectedPlaylist.tracks.push({
          id: index,
          name: track.track.name,
          artist: track.track.artists[0].name,
          album: track.track.album,
          duration: this.convertTime(track.track.duration_ms),
          img: track.track.album.images[2].url
        });
      });
    });
  }

  convertTime(ms: string): string {
    const minutes = Math.floor(Number(ms) / 60000);
    const seconds = ((Number(ms) % 60000) / 1000).toFixed(0);
    return `${minutes}:${(Number(seconds) < 10 ? "0" : "")}${seconds}`;
  }
}
