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
  public commonArtists: Array<string>;
  public showStats: boolean = false;
  public percentSimilar: number = 0;

  constructor() { 
    this.leftPlaylist = { id: -1, name: '', tracks: [] };
    this.rightPlaylist = { id: -1, name: '', tracks: [] };
    this.commonTracks = [];
    this.commonArtists = [];
  }

  ngOnInit(): void {
  }

  comparePlaylists(event: Event) {
    const leftTracks = this.leftPlaylist?.tracks;
    const rightTracks = this.rightPlaylist?.tracks;

    if (leftTracks?.length && rightTracks?.length) {
      let commonTracks = [];
      let commonArtists: Array<string> = [];
      let leftArtists: Array<string> = [];
      let rightArtists: Array<string> = [];

      for (let ltrack of leftTracks) {
        if (!leftArtists.includes(ltrack.artist)) {
          leftArtists.push(ltrack.artist);
        }

        for (let rtrack of rightTracks) {
          if (!rightArtists.includes(rtrack.artist)) {
            rightArtists.push(rtrack.artist);
          }
          if (this.trackMatch(ltrack, rtrack)) {
            commonTracks.push(ltrack);
          }
          if (this.artistMatch(ltrack, rtrack) && !commonArtists.includes(ltrack.artist)) {
            commonArtists.push(ltrack.artist);
          }
        }
      }
      this.commonTracks = commonTracks;
      this.commonArtists = commonArtists;

      const unionTracks = leftTracks.length + rightTracks.length - commonTracks.length;
      const unionArtists = leftArtists.length + rightArtists.length - commonArtists.length;

      this.percentSimilar = Math.floor((commonTracks.length + commonArtists.length) / (unionTracks + unionArtists) * 100);
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

  artistMatch(t1: Track, t2: Track) {
    if (t1 && t2) {
      return t1.artist == t2.artist;
    }

    return false;
  }

}
