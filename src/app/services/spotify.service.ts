import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { DOCUMENT } from '@angular/common';
import { Playlist } from '../components/playlist-select/playlist-select.component';
import { Track } from '../components/track/track.component';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  public accessToken: string = '';

  constructor(private http: HttpClient) { 
  }

  public setToken(token: string) {
    console.log('setToken called with', token);
    this.accessToken = token;
  }

  public authenticate(): void {
    const CLIENT_ID = '7d50145a89474758897e8d01c113bf38';
    const REDIRECT_URI = `http:%2F%2Flocalhost:4200%2Fhome%2F`;
    const SCOPES = 'user-read-private%20user-read-email';

    document.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES}&state=123`;
  }

  public getPlaylists() {
    console.log('token', this.accessToken);
    return this.http.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': 'Bearer ' + this.accessToken
        },
        params: {
          limit: 50
        }
    });
  }

  public getTracks(uri: string) {
    return this.http.get(uri, {
      headers: {
        'Authorization': 'Bearer ' + this.accessToken
      }
    });
  }
}
