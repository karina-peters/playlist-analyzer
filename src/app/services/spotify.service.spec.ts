import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { fakeAsync, TestBed } from "@angular/core/testing";
import { IArtistDTO, IPlaylistsDTO, IPlaylistTrackDTO, ISearchResultsDTO, ITrack, IUserDTO } from "../models/spotify-response.models";

import { SpotifyService } from "./spotify.service";

describe("PlaylistService", () => {
  let service: SpotifyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SpotifyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getCurrentUser", () => {
    it("should return current user", fakeAsync(() => {
      const user = { id: "id-0", display_name: "name" } as IUserDTO;

      service.getCurrentUser().subscribe((response) => {
        expect(response).toEqual(user);
      });

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/me" });
      request.flush(user);

      httpMock.verify();
    }));

    it("should retrieve current user from cache", fakeAsync(() => {
      const user = { id: "id-0", display_name: "name" } as IUserDTO;

      service.getCurrentUser().subscribe();

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/me" });
      request.flush(user);

      service.getCurrentUser().subscribe((response) => {
        expect(response).toEqual(user);
      });

      httpMock.expectNone("https://api.spotify.com/v1/me");

      httpMock.verify();
    }));

    it("should throw error", fakeAsync(() => {
      const mockErrorResponse = { message: "failed to retrieve user" };

      service.getCurrentUser().subscribe(
        () => {},
        (err) => {
          expect(err.error.message).toEqual(mockErrorResponse.message);
        }
      );

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/me" });
      request.flush({ message: mockErrorResponse.message }, { status: 400, statusText: "" });

      httpMock.verify();
    }));
  });

  describe("getPlaylists", () => {
    it("should return current user playlists", fakeAsync(() => {
      const allPlaylists = getMockPlaylists(0, 6);
      service.getPlaylists().subscribe((response) => {
        expect(response).toEqual(allPlaylists);
      });

      const request1 = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/me/playlists?limit=50" });
      request1.flush({
        next: "nextUrl",
        items: getMockPlaylists(0, 3),
      });

      const request2 = httpMock.expectOne({ method: "GET", url: "nextUrl?limit=50" });
      request2.flush({
        next: "",
        items: getMockPlaylists(3, 3),
      });

      httpMock.verify();
    }));

    it("should retrieve playlists from cache", fakeAsync(() => {
      service.getPlaylists().subscribe();

      const request1 = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/me/playlists?limit=50" });
      request1.flush({
        next: "",
        items: getMockPlaylists(0, 3),
      });

      service.getPlaylists().subscribe((response) => {
        expect(response).toEqual(getMockPlaylists(0, 3));
      });

      httpMock.expectNone("https://api.spotify.com/v1/me/playlists?limit=50");

      httpMock.verify();
    }));

    it("should throw error", fakeAsync(() => {
      const mockErrorResponse = { message: "failed to retrieve playlists" };

      service.getPlaylists().subscribe(
        () => {},
        (err) => {
          expect(err.error.message).toEqual(mockErrorResponse.message);
        }
      );

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/me/playlists?limit=50" });
      request.flush({ message: mockErrorResponse.message }, { status: 400, statusText: "" });

      httpMock.verify();
    }));
  });

  describe("getPlaylistItems", () => {
    it("should return playlist items", fakeAsync(() => {
      const allTracks = getMockTracks(0, 6);
      service.getPlaylistItems("id").subscribe((response) => {
        expect(response).toEqual(allTracks);
      });

      const request1 = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/playlists/id/tracks?limit=50" });
      request1.flush({
        next: "nextUrl",
        items: getMockTracks(0, 4),
      });

      const request2 = httpMock.expectOne({ method: "GET", url: "nextUrl?limit=50" });
      request2.flush({
        next: "",
        items: getMockTracks(4, 2),
      });

      httpMock.verify();
    }));

    it("should throw error", fakeAsync(() => {
      const mockErrorResponse = { message: "failed to retrieve playlist items" };

      service.getPlaylistItems("id").subscribe(
        () => {},
        (err) => {
          expect(err.error.message).toEqual(mockErrorResponse.message);
        }
      );

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/playlists/id/tracks?limit=50" });
      request.flush({ message: mockErrorResponse.message }, { status: 400, statusText: "" });

      httpMock.verify();
    }));
  });

  describe("checkSavedTracks", () => {
    it("should return saved statuses", fakeAsync(() => {
      const statuses = [true, true, false, true, false];
      const ids = ["id-0", "id-1", "id-2", "id-3", "id-4"];

      service.checkSavedTracks(ids).subscribe((response) => {
        expect(response).toEqual(statuses);
      });

      const request1 = httpMock.expectOne({ method: "GET", url: `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}` });
      request1.flush(statuses);

      httpMock.verify();
    }));

    it("should throw error", fakeAsync(() => {
      const mockErrorResponse = { message: "failed to retrieve saved statuses" };
      const ids = ["id-0", "id-1", "id-2", "id-3", "id-4"];

      service.checkSavedTracks(ids).subscribe(
        () => {},
        (err) => {
          expect(err.error.message).toEqual(mockErrorResponse.message);
        }
      );

      const request = httpMock.expectOne({ method: "GET", url: `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}` });
      request.flush({ message: mockErrorResponse.message }, { status: 400, statusText: "" });

      httpMock.verify();
    }));
  });

  describe("getSeveralArtists", () => {
    it("should return artists", fakeAsync(() => {
      const ids = ["id-0", "id-1", "id-2", "id-3", "id-4"];
      const allArtists = getMockArtists(0, 5);

      service.getSeveralArtists(ids, 3).subscribe((response) => {
        expect(response).toEqual(allArtists);
      });

      const request1 = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/artists?ids=id-0,id-1,id-2" });
      request1.flush(getMockArtists(0, 3));

      const request2 = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/artists?ids=id-3,id-4" });
      request2.flush(getMockArtists(3, 2));

      httpMock.verify();
    }));

    it("should retrieve artists from cache", fakeAsync(() => {
      const ids = ["id-0", "id-1", "id-2", "id-3", "id-4"];
      const allArtists = getMockArtists(0, 5);

      service.getSeveralArtists(ids).subscribe();

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/artists?ids=id-0,id-1,id-2,id-3,id-4" });
      request.flush(getMockArtists(0, 5));

      service.getSeveralArtists(ids).subscribe((response) => {
        expect(response).toEqual(allArtists);
      });

      httpMock.expectNone("https://api.spotify.com/v1/me/playlists?limit=50");

      httpMock.verify();
    }));

    it("should throw error", fakeAsync(() => {
      const mockErrorResponse = { message: "failed to retrieve artists" };
      const ids = ["id-0", "id-1", "id-2", "id-3", "id-4"];

      service.getSeveralArtists(ids).subscribe(
        () => {},
        (err) => {
          expect(err.error.message).toEqual(mockErrorResponse.message);
        }
      );

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/artists?ids=id-0,id-1,id-2,id-3,id-4" });
      request.flush({ message: mockErrorResponse.message }, { status: 400, statusText: "" });

      httpMock.verify();
    }));
  });

  describe("getSearchResults", () => {
    it("should return search results", fakeAsync(() => {
      const results = { tracks: {} } as ISearchResultsDTO;

      service.getSearchResults("query", "type").subscribe((response) => {
        expect(response).toEqual(results);
      });

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/search?q=query&type=type&limit=10" });
      request.flush(results);

      httpMock.verify();
    }));

    it("should throw error", fakeAsync(() => {
      const mockErrorResponse = { message: "failed to retrieve search results" };

      service.getSearchResults("query", "type").subscribe(
        () => {},
        (err) => {
          expect(err.error.message).toEqual(mockErrorResponse.message);
        }
      );

      const request = httpMock.expectOne({ method: "GET", url: "https://api.spotify.com/v1/search?q=query&type=type&limit=10" });
      request.flush({ message: mockErrorResponse.message }, { status: 400, statusText: "" });

      httpMock.verify();
    }));
  });
});

function getMockPlaylists(offset: number, num: number) {
  let playlists = [];

  for (let i = 0; i < num; ++i) {
    playlists.push({
      id: `id-${i + offset}`,
      name: "name",
    } as IPlaylistsDTO);
  }

  return playlists;
}

function getMockTracks(offset: number, num: number) {
  let tracks = [];

  for (let i = 0; i < num; ++i) {
    tracks.push({
      track: {
        id: `id-${i + offset}`,
        name: "name",
      } as ITrack,
    } as IPlaylistTrackDTO);
  }

  return tracks;
}

function getMockArtists(offset: number, num: number) {
  let artists = [];

  for (let i = 0; i < num; ++i) {
    artists.push({
      id: `id-${i + offset}`,
      name: "name",
    } as IArtistDTO);
  }

  return artists;
}
