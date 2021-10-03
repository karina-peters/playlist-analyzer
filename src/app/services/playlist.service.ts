import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  public accessToken: string = '';

  constructor(private http: HttpClient) { 
  }

  public getPlaylists() {
    // this.authenticate().subscribe((response) => {
    //   this.http.get('https://api.spotify.com/v1/me', {
    //     headers: {
    //       'Authorization': 'Bearer ' + this.accessToken
    //     }
    //   })  
    // });
    return this.http.get("https://api.spotify.com/v1/me/playlists");
  }

  public authenticate() {
    const params = new HttpParams()
      .set('client_id', '7d50145a89474758897e8d01c113bf38')
      .set('response_type', 'token')
      .set('redirectUri', 'https://localhost:4200')
      // .set('scope', )

    return this.http.get('https://accounts.spotify.com/authorize', { params: params });
  }
}
