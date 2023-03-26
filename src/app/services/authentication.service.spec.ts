import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { fakeAsync, TestBed } from "@angular/core/testing";

import { AuthenticationService } from "./authentication.service";

describe("AuthenticationService", () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  const accessToken = { access_token: "access_token" };
  const tokens = {
    access_token: "access_token",
    refresh_token: "refresh_token",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("requestAccess", () => {
    it("should return true when access and refresh tokens updated", fakeAsync(() => {
      spyOn(service, "redirect").and.callFake(() => {});
      service.requestAccess();

      expect(service.redirect).toHaveBeenCalledWith(
        "https://accounts.spotify.com/authorize?client_id=7d50145a89474758897e8d01c113bf38&redirect_uri=http://localhost:4200/home/&scope=user-read-private%20user-read-email%20user-library-read%20playlist-read-private%20playlist-modify-public%20playlist-modify-private&show_dialog=false&response_type=code&state=123"
      );
    }));
  });

  describe("requestToken", () => {
    it("should return true when access and refresh tokens updated", fakeAsync(() => {
      const queryString = "query?code=testcode";
      service.requestToken(queryString).subscribe((value) => {
        expect(value).toEqual(true);
      });

      const request = httpMock.expectOne({ method: "POST", url: "https://accounts.spotify.com/api/token" });
      request.flush(tokens);

      httpMock.verify();
    }));

    it("should return false when response undefined", fakeAsync(() => {
      const queryString = "query?code=testcode";
      service.requestToken(queryString).subscribe((value) => {
        expect(value).toEqual(false);
      });

      const request = httpMock.expectOne({ method: "POST", url: "https://accounts.spotify.com/api/token" });
      request.flush(null);

      httpMock.verify();
    }));

    it("should return false when request fails", fakeAsync(() => {
      const queryString = "query?code=testcode";
      service.requestToken(queryString).subscribe((value) => {
        expect(value).toEqual(false);
      });

      const request = httpMock.expectOne({ method: "POST", url: "https://accounts.spotify.com/api/token" });
      request.error(new ErrorEvent("error"));

      httpMock.verify();
    }));
  });

  describe("refreshToken", () => {
    it("should return true when access token updated", fakeAsync(() => {
      service.refreshToken().subscribe((value) => {
        expect(value).toEqual(true);
      });

      const request = httpMock.expectOne({ method: "POST", url: "https://accounts.spotify.com/api/token" });
      request.flush(accessToken);

      httpMock.verify();
    }));

    it("should return false when refresh_token null", fakeAsync(() => {
      spyOn(localStorage, "getItem").and.returnValue(null);

      service.refreshToken().subscribe((value) => {
        expect(value).toEqual(false);
      });

      httpMock.expectNone({ method: "POST", url: "https://accounts.spotify.com/api/token" });
      httpMock.verify();
    }));

    it("should return false when response undefined", fakeAsync(() => {
      service.refreshToken().subscribe((value) => {
        expect(value).toEqual(false);
      });

      const request = httpMock.expectOne({ method: "POST", url: "https://accounts.spotify.com/api/token" });
      request.flush(null);

      httpMock.verify();
    }));

    it("should return false when request fails", fakeAsync(() => {
      service.refreshToken().subscribe((value) => {
        expect(value).toEqual(false);
      });

      const request = httpMock.expectOne({ method: "POST", url: "https://accounts.spotify.com/api/token" });
      request.error(new ErrorEvent("error"));

      httpMock.verify();
    }));
  });
});
