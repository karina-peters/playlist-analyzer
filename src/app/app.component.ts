import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GettingStarted';

  private accessToken: string;
  constructor(private spotifyService: SpotifyService) {
    this.accessToken = '';
  }

  ngOnInit(): void {
    let params = window.location.hash.split('&');
    this.accessToken = params[0].split('=')[1];
    this.spotifyService.setToken(this.accessToken);
  }
}
