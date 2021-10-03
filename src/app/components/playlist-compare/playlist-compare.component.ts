import { Component, OnInit } from '@angular/core';
import { Playlist } from '../playlist-select/playlist-select.component'
import { Track } from '../track/track.component'

@Component({
  selector: 'app-playlist-compare',
  templateUrl: './playlist-compare.component.html',
  styleUrls: ['./playlist-compare.component.scss']
})
export class PlaylistCompareComponent implements OnInit {

  public leftPlaylist: Playlist;
  public rightPlaylist: Playlist;
  public commonTracks: Array<Track>;
  public showStats: boolean = false;
  public percentSimilar: number = 0;

  constructor() { 
    this.leftPlaylist = { id: -1, tracks: [] };
    this.rightPlaylist = { id: -1, tracks: [] };
    this.commonTracks = [];
  }

  ngOnInit(): void {
  }

  comparePlaylists(event: Event) {
    const leftTracks = this.leftPlaylist?.tracks;
    const rightTracks = this.rightPlaylist?.tracks;

    if (leftTracks?.length && rightTracks?.length) {
      let common = [];

      for (let ltrack of leftTracks) {
        for (let rtrack of rightTracks) {
          if (this.trackMatch(ltrack, rtrack)) {
            common.push(ltrack);
          }
        }
      }
      this.commonTracks = common;
      this.percentSimilar = Math.floor((common.length / (leftTracks.length + rightTracks.length)) * 100);
      this.showStats = true;
    }
  }

  selectLeft(playlist: Playlist) {
    this.leftPlaylist = playlist;
    this.showStats = false;
    console.log("left id", playlist.id);
  }

  selectRight(playlist: Playlist) {
    this.rightPlaylist = playlist;
    this.showStats = false;
    console.log("right id", playlist.id);
  }

  trackMatch(t1: Track, t2: Track) {
    if (t1 && t2) {
      return t1.name == t2.name && t1.artist == t2.artist;
    }

    return false;
  }

}
