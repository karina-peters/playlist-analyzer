import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Track } from '../track/track.component'
import { PlaylistService } from 'src/app/services/playlist.service'

export interface Playlist {
  id: number,
  name: string,
  description?: string,
  tracks: Array<any>
}

@Component({
  selector: 'app-playlist-select',
  templateUrl: './playlist-select.component.html',
  styleUrls: ['./playlist-select.component.scss']
})
export class PlaylistSelectComponent implements OnInit {

  public playlists: Array<Playlist>;
  public selected: Playlist = { id: -1, name: "", tracks: []};
  public showOptions: boolean = false;
  public selectText: string = "Choose a Playlist";
  @Output() selectedEvent = new EventEmitter<Playlist>();

  constructor(private playlistService: PlaylistService) { 

    this.playlists = [
    //   {
    //     id: 0,
    //     name: "most listened to",
    //     tracks: [{
    //       id: 0,
    //       name: "white noise",
    //       artist: "flor",
    //       album: "reimagined",
    //       duration: "3:02"
    //     },
    //     {
    //       id: 1,
    //       name: "Falling",
    //       artist: "Chase Atlantic",
    //       album: "Paradise EP",
    //       duration: "3:43"
    //     },
    //     {
    //       id: 2,
    //       name: "Break",
    //       artist: "Cooper & Gatlin",
    //       album: "Break",
    //       duration: "3:33"
    //     },
    //     {
    //       id: 3,
    //       name: "I Want You Close",
    //       artist: "By the Coast",
    //       album: "Twist of Fate",
    //       duration: "4:26"
    //     },
    //     {
    //       id: 4,
    //       name: "Miles Ahead",
    //       artist: "The Strink",
    //       album: "Miles Ahead",
    //       duration: "4:06"
    //     },
    //     {
    //       id: 5,
    //       name: "Bubblegum",
    //       artist: "TOTEM",
    //       album: "Bubblegum",
    //       duration: "3:27"
    //     },
    //     {
    //       id: 6,
    //       name: "get behind this",
    //       artist: "flor",
    //       album: "get behind this",
    //       duration: "3:25"
    //     },
    //     {
    //       id: 7,
    //       name: "Just a Little Longer",
    //       artist: "SHY Martin",
    //       album: "Overthinking",
    //       duration: "3:26"
    //     },
    //     {
    //       id: 8,
    //       name: "Phases",
    //       artist: "PRETTYMUCH",
    //       album: "Phases",
    //       duration: "3:36"
    //     },
    //     {
    //       id: 9,
    //       name: "never was mine",
    //       artist: "flor",
    //       album: "ley lines",
    //       duration: "4:32"
    //     }]
    //   },
    //   {
    //     id: 1,
    //     name: "something for everyone",
    //     tracks: [{
    //       id: 0,
    //       name: "Hold On, We're Going Home",
    //       artist: "Drake",
    //       album: "Nothing Was The Same",
    //       duration: "3:48"
    //     },
    //     {
    //       id: 1,
    //       name: "Love$ick (ft. A$AP Rocky)",
    //       artist: "Mura Masa",
    //       album: "Mura Masa",
    //       duration: "3:12"
    //     },
    //     {
    //       id: 2,
    //       name: "Talk (ft. Disclosure)",
    //       artist: "Khalid",
    //       album: "Free Spirit",
    //       duration: "3:18"
    //     }]
    //   },
    //   {
    //     id: 2,
    //     name: "current faves",
    //     tracks: [{
    //       id: 0,
    //       name: "white noise",
    //       artist: "flor",
    //       album: "reimagined",
    //       duration: "3:02"
    //     },
    //     {
    //       id: 1,
    //       name: "Falling",
    //       artist: "Chase Atlantic",
    //       album: "Paradise EP",
    //       duration: "3:43"
    //     },
    //     {
    //       id: 2,
    //       name: "Who You Are",
    //       artist: "Loote",
    //       album: "Who You Are",
    //       duration: "3:16"
    //     },
    //     {
    //       id: 3,
    //       name: "Teenage Dirtbag",
    //       artist: "eleventyseven",
    //       album: "Teenage Dirtbag",
    //       duration: "3:41"
    //     },
    //     {
    //       id: 4,
    //       name: "the last great american dynasty",
    //       artist: "Taylor Swift",
    //       album: "folklore",
    //       duration: "3:51"
    //     },
    //     {
    //       id: 5,
    //       name: "Stay Next To Me (With Chelsea Cutler)",
    //       artist: "Quinn XCII",
    //       album: "Stay Next To Me (With Chelsea Cutler)",
    //       duration: "3:26"
    //     },
    //     {
    //       id: 6,
    //       name: "Waves",
    //       artist: "Kanye West",
    //       album: "The Life of Pablo",
    //       duration: "3:02"
    //     },
    //     {
    //       id: 7,
    //       name: "Close Isn't Enough",
    //       artist: "daena",
    //       album: "Close Isn't Enough",
    //       duration: "4:22"
    //     }]
    //   },
    //   {
    //     id: 3,
    //     name: "fruit smoothie",
    //     tracks: [{
    //       id: 0,
    //       name: "I Like Me Better",
    //       artist: "Lauv",
    //       album: "I Like Me Better",
    //       duration: "3:17"
    //     },
    //     {
    //       id: 1,
    //       name: "Breathe (Lauv Remix)",
    //       artist: "Astrid S",
    //       album: "Breathe",
    //       duration: "3:36"
    //     },
    //     {
    //       id: 2,
    //       name: "Goodbye",
    //       artist: "filous",
    //       album: "Goodbye",
    //       duration: "3:23"
    //     },
    //     {
    //       id: 3,
    //       name: "Straightjacket",
    //       artist: "Quinn XCII",
    //       album: "Straightjacket",
    //       duration: "3:26"
    //     },
    //     {
    //       id: 4,
    //       name: "let me in",
    //       artist: "flor",
    //       album: "let me in",
    //       duration: "3:59"
    //     },
    //     {
    //       id: 5,
    //       name: "Getting Over You",
    //       artist: "Lauv",
    //       album: "I met you when I was 18",
    //       duration: "4:16"
    //     }]
    //   },
    //   {
    //     id: 4,
    //     name: "iced coffee",
    //     tracks: [{
    //       id: 0,
    //       name: "Animal",
    //       artist: "Neon Trees",
    //       album: "Habits",
    //       duration: "3:32"
    //     },
    //     {
    //       id: 1,
    //       name: "Electric Love",
    //       artist: "BORNS",
    //       album: "Dopamine",
    //       duration: "3:38"
    //     },
    //     {
    //       id: 2,
    //       name: "Tongue Tied",
    //       artist: "Grouplove",
    //       album: "Never Trust a Happy Song",
    //       duration: "3:38"
    //     }]
    //   },
    ];
  }

  ngOnInit(): void {
    this.playlists = this.playlistService.getPlaylists();
  }

  selectPlaylist(id: number) {
    console.log("selected: ", id);
    this.selectText = this.playlists[id].name;
    this.selected = this.playlists[id];
    this.selectedEvent.emit(this.playlists[id]);
    this.showOptions = false;
  }

  // toggleSelect(_event: Event) {
  //   console.log("toggle select");
  //   if (this.showOptions) {
  //     this.showOptions = false;
  //   }
  //   else {
  //     this.showOptions = true;
  //   }
  // }
}
