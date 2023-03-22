import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { IAlbum, IArtistDTO } from "../models/spotify-response.models";

import { Artist, ArtistService } from "./artist.service";
import { SpotifyService } from "./spotify.service";

import { TrackService } from "./track.service";

const artistServiceSpy = jasmine.createSpyObj("ArtistService", ["equal", "getSeveralArtists"]);
const spotifyServiceSpy = jasmine.createSpyObj("SpotifyService", ["getPlaylistItems", "getSearchResults", "checkSavedTracks"]);

describe("TrackService", () => {
  let service: TrackService;

  beforeEach(() => {
    spotifyServiceSpy.getPlaylistItems.and.returnValue(
      of(
        getMockTracks(3).map((t) => {
          return { track: t };
        })
      )
    );

    artistServiceSpy.getSeveralArtists.and.callFake((ids: Array<string>) => {
      return of(
        ids.map((id) => {
          return { id: id, link: "", img: "", name: `Artist ${id[id.length - 1]}`, genres: [] };
        })
      );
    });
    artistServiceSpy.equal.and.callFake((a1: Artist, a2: Artist) => {
      return a1.id == a2.id;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: SpotifyService, useValue: spotifyServiceSpy },
        { provide: ArtistService, useValue: artistServiceSpy },
      ],
    });
    service = TestBed.inject(TrackService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getPlaylistTracks", () => {
    it("should throw error when request fails", fakeAsync(() => {
      const errorMsg = "failed to retrieve tracks";
      spotifyServiceSpy.getPlaylistItems.and.callFake(() => {
        return throwError(new Error(errorMsg));
      });

      service.getPlaylistTracks("playlist-0").subscribe(
        () => {},
        (err) => {
          expect(err.message).toEqual(errorMsg);
        }
      );

      tick();

      expect(spotifyServiceSpy.getPlaylistItems).toHaveBeenCalled();
    }));
  });

  describe("getPlaylistTracksDetailed", () => {
    it("should return detailed tracks", () => {
      service.getPlaylistTracksDetailed("playlist-0").subscribe((response) => {
        expect(response).toEqual([getMockTrack(0, "Track 0"), getMockTrack(1, "Track 1"), getMockTrack(2, "Track 2")]);
      });

      expect(spotifyServiceSpy.getPlaylistItems).toHaveBeenCalled();
      expect(artistServiceSpy.getSeveralArtists).toHaveBeenCalled();
    });

    it("should throw error when request fails", fakeAsync(() => {
      const errorMsg = "failed to retrieve tracks";
      artistServiceSpy.getSeveralArtists.and.callFake(() => {
        return throwError(new Error(errorMsg));
      });

      service.getPlaylistTracksDetailed("playlist-0").subscribe(
        () => {},
        (err) => {
          expect(err.message).toEqual(errorMsg);
        }
      );

      tick();

      expect(spotifyServiceSpy.getPlaylistItems).toHaveBeenCalled();
      expect(artistServiceSpy.getSeveralArtists).toHaveBeenCalled();
    }));
  });

  describe("searchTracks", () => {
    it("should return search results", () => {
      spotifyServiceSpy.getSearchResults.and.returnValue(of({ tracks: { items: getMockTracks(3) } }));

      service.searchTracks("query", "track").subscribe((response) => {
        expect(response).toEqual([getMockTrack(0, "Track 0"), getMockTrack(1, "Track 1"), getMockTrack(2, "Track 2")]);
      });

      expect(spotifyServiceSpy.getSearchResults).toHaveBeenCalled();
    });

    it("should throw error when request fails", fakeAsync(() => {
      const errorMsg = "failed to retrieve search results";
      spotifyServiceSpy.getSearchResults.and.callFake(() => {
        return throwError(new Error(errorMsg));
      });

      service.searchTracks("query-fail", "track").subscribe(
        () => {},
        (err) => {
          expect(err.message).toEqual(errorMsg);
        }
      );

      tick();

      expect(spotifyServiceSpy.getSearchResults).toHaveBeenCalled();
    }));
  });

  describe("checkSavedTracks", () => {
    it("should return saved statuses", () => {
      const statuses = [true, false, true, false, true];
      spotifyServiceSpy.checkSavedTracks.and.returnValue(of(statuses));

      service.checkSavedTracks(["id-0", "id-1", "id-2", "id-3", "id-4"]).subscribe((response) => {
        expect(response).toEqual(statuses);
      });

      expect(spotifyServiceSpy.checkSavedTracks).toHaveBeenCalled();
    });

    it("should throw error when request fails", fakeAsync(() => {
      const errorMsg = "failed to retrieve saved statuses";
      spotifyServiceSpy.checkSavedTracks.and.callFake(() => {
        return throwError(new Error(errorMsg));
      });

      service.checkSavedTracks(["id-0", "id-1"]).subscribe(
        () => {},
        (err) => {
          expect(err.message).toEqual(errorMsg);
        }
      );

      tick();

      expect(spotifyServiceSpy.checkSavedTracks).toHaveBeenCalled();
    }));
  });

  describe("equal", () => {
    it("should return true when tracks equal", () => {
      const track1 = getMockTrack(0, "Track");
      const track2 = getMockTrack(0, "Track");

      expect(service.equal(track1, track2)).toEqual(true);
    });

    it("should return false when tracks not equal", () => {
      const track1 = getMockTrack(1, "Track 1");
      const track2 = getMockTrack(2, "Track 2");

      expect(service.equal(track1, track2)).toEqual(false);
    });

    it("should return false when tracks undefined", () => {
      const track1 = undefined as any;
      const track2 = undefined as any;

      expect(service.equal(track1, track2)).toEqual(false);
    });
  });

  describe("contains", () => {
    it("should return true when array contains track", () => {
      const trackArray = [getMockTrack(0, "Track 0"), getMockTrack(1, "Track 1"), getMockTrack(2, "Track 2")];
      const track = getMockTrack(0, "Track 0");

      expect(service.contains(trackArray, track)).toEqual(true);
    });

    it("should return false when array does not contain track", () => {
      const trackArray = [getMockTrack(0, "Track 0"), getMockTrack(1, "Track 1"), getMockTrack(2, "Track 2")];
      const track = getMockTrack(5, "Track 5");

      expect(service.contains(trackArray, track)).toEqual(false);
    });
  });
});

function getMockTrack(index: number, name: string) {
  return {
    index: index,
    id: `id-${index}`,
    name: name,
    artist: { id: `artist-${index % 2}`, name: `Artist ${index % 2}`, link: "", img: "", genres: [] },
    album: "",
    duration: "3:00",
    img: "",
    playlists: [],
    liked: false,
    checked: false,
  };
}

function getMockTracks(num: number) {
  let tracks = [];

  for (let i = 0; i < num; ++i) {
    tracks.push({
      id: `id-${i}`,
      href: "",
      name: `Track ${i}`,
      artists: [{ id: `artist-${i % 2}`, href: "", name: `Artist ${i % 2}` } as IArtistDTO],
      album: { name: "", images: [{ url: "" }] } as IAlbum,
      duration_ms: 180000,
    });
  }

  return tracks;
}
