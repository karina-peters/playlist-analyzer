import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
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
  public user$: Subject<User> = new Subject();

  constructor(private spotifyService: SpotifyService) {}

  /**
   * Retrieves current user data and updates user$ subject value.
   */
  public signIn(): void {
    this.spotifyService.getCurrentUser().subscribe((user: IUserDTO) => {
      const currentUser = {
        id: user.id,
        name: user.display_name,
        img: user.images[0].url,
        email: user.email,
      };

      this.user$.next(currentUser);
    });
  }
}
