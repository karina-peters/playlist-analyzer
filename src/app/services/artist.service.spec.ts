import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { IFollowers } from "../models/spotify-response.models";

import { ArtistService } from "./artist.service";
import { SpotifyService } from "./spotify.service";

describe("ArtistService", () => {
  let service: ArtistService;

  const spotifyServiceSpy = jasmine.createSpyObj("SpotifyService", ["getArtist", "getSeveralArtists"]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SpotifyService, useValue: spotifyServiceSpy }],
    });
    service = TestBed.inject(ArtistService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getSeveralArtists", () => {
    it("should return artists", () => {
      spotifyServiceSpy.getSeveralArtists.and.returnValue(of(getMockArtists(3)));

      service.getSeveralArtists(["id-0", "id-1", "id-2"]).subscribe((response) => {
        expect(response).toEqual([getMockArtist(0, "Artist 0"), getMockArtist(1, "Artist 1"), getMockArtist(2, "Artist 2")]);
      });

      expect(spotifyServiceSpy.getSeveralArtists).toHaveBeenCalled();
    });

    it("should throw error when request fails", fakeAsync(() => {
      const errorMsg = "failed to retrieve artists";
      spotifyServiceSpy.getSeveralArtists.and.callFake(() => {
        return throwError(new Error(errorMsg));
      });

      service.getSeveralArtists(["artist1", "artist2"]).subscribe(
        () => {},
        (err) => {
          expect(err.message).toEqual(errorMsg);
        }
      );

      tick();

      expect(spotifyServiceSpy.getSeveralArtists).toHaveBeenCalled();
    }));
  });

  describe("equal", () => {
    it("should return true when artists equal", () => {
      const artist1 = getMockArtist(0, "Artist");
      const artist2 = getMockArtist(0, "Artist");

      expect(service.equal(artist1, artist2)).toEqual(true);
    });

    it("should return false when artists not equal", () => {
      const artist1 = getMockArtist(1, "Artist 1");
      const artist2 = getMockArtist(2, "Artist 2");

      expect(service.equal(artist1, artist2)).toEqual(false);
    });

    it("should return false when artists undefined", () => {
      const artist1 = undefined as any;
      const artist2 = undefined as any;

      expect(service.equal(artist1, artist2)).toEqual(false);
    });
  });

  describe("contains", () => {
    it("should return true when array contains artist", () => {
      const artistArray = [getMockArtist(0, "Artist 0"), getMockArtist(1, "Artist 1"), getMockArtist(2, "Artist 2")];
      const artist = getMockArtist(1, "Artist 1");

      expect(service.contains(artistArray, artist)).toEqual(true);
    });

    it("should return false when array does not contain artist", () => {
      const artistArray = [getMockArtist(0, "Artist 0"), getMockArtist(1, "Artist 1"), getMockArtist(2, "Artist 2")];
      const artist = getMockArtist(4, "Artist 4");

      expect(service.contains(artistArray, artist)).toEqual(false);
    });
  });
});

function getMockArtist(index: number, name: string) {
  return {
    id: `id-${index}`,
    link: "",
    name: name,
    img: `${name}.jpg`,
    genres: [],
  };
}

function getMockArtists(num: number) {
  let artists = [];

  for (let i = 0; i < num; ++i) {
    artists.push({
      external_urls: {},
      followers: {} as IFollowers,
      genres: [],
      href: "",
      id: `id-${i}`,
      images: [{ url: `Artist ${i}.jpg` }],
      name: `Artist ${i}`,
      popularity: 0,
      type: "",
      uri: "",
    });
  }

  return artists;
}
