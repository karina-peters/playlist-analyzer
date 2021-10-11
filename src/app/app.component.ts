import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GettingStarted';

  private accessToken: string;
  constructor(private playlistService: PlaylistService) {
    this.accessToken = '';
  }

  ngOnInit(): void {
    let params = window.location.hash.split('&');
    this.accessToken = params[0].split('=')[1];
    this.playlistService.setToken(this.accessToken);
  }
}
