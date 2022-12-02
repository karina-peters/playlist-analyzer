import { Component, OnInit, Input } from '@angular/core';

export interface Track {
  id: number,
  name: string,
  artist: string,
  album: string,
  duration: string,
  img: string
}

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {

  @Input() trackData = {
    id: 0,
    name: '',
    artist: '',
    album: '',
    duration: '',
    img: ''
  };

  @Input() common: boolean = false;
 
  constructor() { 

  }

  ngOnInit(): void {
  }

}