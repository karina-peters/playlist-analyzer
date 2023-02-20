import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { IFollowers, IImage, IOwner, IPlaylistsDTO, IReference } from "../models/spotify-response.models";

import { PlaylistService } from "./playlist.service";
import { SpotifyService } from "./spotify.service";
import { Track, TrackService } from "./track.service";

const spotifyServiceSpy = jasmine.createSpyObj("SpotifyService", ["getPlaylists"]);
const trackServiceSpy = jasmine.createSpyObj("TrackService", ["equal", "getPlaylistTracksDetailed"]);

describe("PlaylistService", () => {
  let service: PlaylistService;

  beforeEach(() => {
    spotifyServiceSpy.getPlaylists.and.returnValue(of(getMockPlaylists(3)));

    trackServiceSpy.getPlaylistTracksDetailed.and.returnValue(
      of([getMockTrack(0, "Track 0"), getMockTrack(1, "Track 1"), getMockTrack(2, "Track 2")])
    );
    trackServiceSpy.equal.and.callFake((t1: Track, t2: Track) => {
      return t1.id == t2.id;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: SpotifyService, useValue: spotifyServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
    });
    service = TestBed.inject(PlaylistService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getPlaylistTracksDetailed", () => {
    it("should return detailed tracks", () => {
      service.getDetailedUserPlaylists().subscribe((response) => {
        expect(response).toEqual([getMockPlaylist(0, "Playlist 0"), getMockPlaylist(1, "Playlist 1"), getMockPlaylist(2, "Playlist 2")]);
      });

      expect(trackServiceSpy.getPlaylistTracksDetailed).toHaveBeenCalled();
    });

    it("should throw error when request fails", fakeAsync(() => {
      const errorMsg = "failed to retrieve tracks";
      spotifyServiceSpy.getPlaylists.and.callFake(() => {
        return throwError(new Error(errorMsg));
      });

      service.getDetailedUserPlaylists().subscribe(
        () => {},
        (err) => {
          expect(err.message).toEqual(errorMsg);
        }
      );

      tick();

      expect(spotifyServiceSpy.getPlaylists).toHaveBeenCalled();
    }));
  });

  describe("containsTrack", () => {
    it("should return true when playlist contains track", () => {
      const playlist = getMockPlaylist(0, "Playlist");
      const track = getMockTrack(1, "Track 1");

      expect(service.containsTrack(playlist, track)).toEqual(true);
    });

    it("should return false when playlist does not contain track", () => {
      const playlist = getMockPlaylist(0, "Playlist");
      const track = getMockTrack(5, "Track 5");

      expect(service.containsTrack(playlist, track)).toEqual(false);
    });

    it("should return false when playlist undefined", () => {
      const playlist = undefined as any;
      const track = undefined as any;

      expect(service.containsTrack(playlist, track)).toEqual(false);
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

function getMockPlaylist(index: number, name: string) {
  return {
    index: index,
    id: `id-${index}`,
    name: name,
    description: "",
    tracks: [getMockTrack(0, "Track 0"), getMockTrack(1, "Track 1"), getMockTrack(2, "Track 2")],
    tracksLink: "",
    tracksCount: 3,
    img: "",
    owner: "",
    selected: false,
  };
}

function getMockPlaylists(num: number): Array<IPlaylistsDTO> {
  let playlists = [];

  for (let i = 0; i < num; ++i) {
    playlists.push({
      id: `id-${i}`,
      name: `Playlist ${i}`,
      description: "",
      collaborative: false,
      external_urls: [],
      followers: {} as IFollowers,
      href: "",
      images: [{ url: "" } as IImage],
      owner: { id: "" } as IOwner,
      primary_color: "",
      public: true,
      snapshot_id: "",
      tracks: { href: "", total: 3 } as IReference,
      type: "",
    });
  }

  return playlists;
}
