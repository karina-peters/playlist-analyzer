import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";
import { PlaylistService } from "src/app/services/playlist.service";
import { UserService } from "src/app/services/user.service";

import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const authServiceSpy = jasmine.createSpyObj("AuthenticationService", ["requestAccess"]);
  const playlistServiceSpy = jasmine.createSpyObj("PlaylistService", ["getDetailedUserPlaylists"]);
  const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
  const userServiceSpy = jasmine.createSpyObj("UserService", ["signIn"]);

  beforeEach(async () => {
    playlistServiceSpy.getDetailedUserPlaylists.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: PlaylistService, useValue: playlistServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
