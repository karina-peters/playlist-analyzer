import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { SpotifyService } from "./spotify.service";
import { IUserDTO } from "src/app/models/spotify-response.models";

export interface User {
  id: string;
  name: string;
  img: string;
  email: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private spotifyService: SpotifyService) {}

  /**
   * Retrieves current user data.
   * @returns An Observable containing a User object
   */
  public getCurrentUser(): Observable<User> {
    return this.spotifyService.getCurrentUser().pipe(
      map((user: IUserDTO) => {
        const ret = {
          id: user.id,
          name: user.display_name,
          img: user.images[0].url,
          email: user.email,
        };

        return ret;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }
}
