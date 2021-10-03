import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Track } from '../track/track.component'
import { PlaylistService } from 'src/app/services/playlist.service'

export interface Playlist {
  id: number,
  name?: string,
  description?: string,
  tracks: Array<Track>
}

@Component({
  selector: 'app-playlist-select',
  templateUrl: './playlist-select.component.html',
  styleUrls: ['./playlist-select.component.scss']
})
export class PlaylistSelectComponent implements OnInit {

  public playlists: Array<Playlist>;
  public selected: number;
  @Output() selectedEvent = new EventEmitter<Playlist>();

  constructor(private playlistService: PlaylistService) { 

    this.playlists = [
      {
        id: 0,
        name: "test playlist #1",
        tracks: [{
          id: 0,
          name: "test track #1",
          artist: "artist #1",
          album: "test album #1"
        },
        {
          id: 1,
          name: "test track #2",
          artist: "artist #2",
          album: "test album #2"
        },
        {
          id: 2,
          name: "test track #3",
          artist: "artist #3",
          album: "test album #3"
        }]
      },
      {
        id: 1,
        name: "test playlist #2",
        tracks: [{
          id: 0,
          name: "test track #3",
          artist: "artist #3",
          album: "test album #3"
        },
        {
          id: 1,
          name: "test track #4",
          artist: "artist #4",
          album: "test album #4"
        },
        {
          id: 2,
          name: "test track #5",
          artist: "artist #5",
          album: "test album #5"
        }]
      },
      {
        id: 2,
        name: "test playlist #3",
        tracks: [{
          id: 0,
          name: "test track #6",
          artist: "artist #6",
          album: "test album #6"
        },
        {
          id: 1,
          name: "test track #7",
          artist: "artist #7",
          album: "test album #7"
        },
        {
          id: 2,
          name: "test track #8",
          artist: "artist #8",
          album: "test album #8"
        }]
      },
      {
        id: 3,
        name: "test playlist #4",
        tracks: [{
          id: 0,
          name: "test track #1",
          artist: "artist #1",
          album: "test album #1"
        },
        {
          id: 1,
          name: "test track #2",
          artist: "artist #2",
          album: "test album #2"
        },
        {
          id: 2,
          name: "test track #3",
          artist: "artist #3",
          album: "test album #3"
        }]
      },
      {
        id: 4,
        name: "test playlist #5",
        tracks: [{
          id: 0,
          name: "test track #1",
          artist: "artist #1",
          album: "test album #1"
        },
        {
          id: 1,
          name: "test track #2",
          artist: "artist #2",
          album: "test album #2"
        },
        {
          id: 2,
          name: "test track #3",
          artist: "artist #3",
          album: "test album #3"
        }]
      },
    ];

    this.selected = -1;
  }

  ngOnInit(): void {
    this.playlistService.getPlaylists();
    console.log(this.playlistService.getPlaylists());
  }

  selectPlaylist(_event: Event) {
    this.selectedEvent.emit(this.playlists[this.selected]);
  }
}
