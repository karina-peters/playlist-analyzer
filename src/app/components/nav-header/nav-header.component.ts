import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit {

  constructor(private playlistService: PlaylistService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.playlistService.authenticate();
  }
}
