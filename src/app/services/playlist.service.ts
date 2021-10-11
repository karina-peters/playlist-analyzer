import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { DOCUMENT } from '@angular/common';
import { Playlist } from '../components/playlist-select/playlist-select.component';
import { Track } from '../components/track/track.component';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  public accessToken: string = '';

  constructor(private http: HttpClient) { 
  }

  public getPlaylists(): Array<Playlist> {
    let playlists: Array<Playlist> = [];
    console.log('token', this.accessToken);
    this.http.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': 'Bearer ' + this.accessToken
        },
        params: {
          limit: 50
        }
    }).subscribe((response: any) => {
        console.log(response);
        response.items.forEach((playlist: any, index: number) => {
          // TODO: tracks
          let tracks = playlist.tracks;
          playlists.push({
            id: index,
            name: playlist.name,
            description: playlist.description,
            tracks: []
          })
        });
        console.log(playlists);
    });
    return playlists;
  }

  public authenticate(): void {
    const CLIENT_ID = '7d50145a89474758897e8d01c113bf38';
    const REDIRECT_URI = `http:%2F%2Flocalhost:4200%2F`;
    const SCOPES = 'user-read-private%20user-read-email';

    document.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES}&state=123`;
  }

  public setToken(token: string) {
    console.log('setToken called with', token);
    this.accessToken = token;
  }

  public getTracks(uri: string): Array<Track> {
    // TODO
    let tracks: Array<Track> = [];
    return tracks;
  }
}
