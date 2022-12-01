import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private accessToken: string = '';

  constructor(private http: HttpClient) { 
  }

  public setToken(token: string): void {
    console.log('setToken called with', token);
    this.accessToken = token;
  }

  public getToken(): string {
    return this.accessToken;
  }

  public authenticate(redirect?: string): void {
    const CLIENT_ID = '7d50145a89474758897e8d01c113bf38';
    const REDIRECT_URI = redirect ? `http:%2F%2Flocalhost:4200%2F${redirect}%2F` : `http:%2F%2Flocalhost:4200%2Fhome%2F`;
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
