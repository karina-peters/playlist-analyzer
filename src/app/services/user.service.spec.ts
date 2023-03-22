import { componentFactoryName } from "@angular/compiler";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { SpotifyService } from "./spotify.service";

import { UserService } from "./user.service";

const spotifyServiceSpy = jasmine.createSpyObj("SpotifyService", ["getCurrentUser"]);

describe("UserService", () => {
  let service: UserService;

  const user = {
    id: "id",
    email: "email",
    display_name: "name",
    images: [
      {
        url: "",
      },
    ],
  };

  beforeEach(() => {
    spotifyServiceSpy.getCurrentUser.and.returnValue(of(user));

    TestBed.configureTestingModule({
      providers: [{ provide: SpotifyService, useValue: spotifyServiceSpy }],
    });
    service = TestBed.inject(UserService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("signIn", () => {
    it("should update user$ subject", fakeAsync(() => {
      service.signIn();
      service.user$.subscribe((value) => {
        expect(value).toEqual({
          id: "id",
          name: "name",
          email: "email",
          img: "",
        });
      });

      expect(spotifyServiceSpy.getCurrentUser).toHaveBeenCalled();
    }));
  });
});
