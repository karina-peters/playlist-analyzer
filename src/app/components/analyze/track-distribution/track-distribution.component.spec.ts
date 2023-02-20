import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { PlaylistService } from "src/app/services/playlist.service";
import { TrackService } from "src/app/services/track.service";

import { TrackDistributionComponent } from "./track-distribution.component";

describe("TrackDistributionComponent", () => {
  let component: TrackDistributionComponent;
  let fixture: ComponentFixture<TrackDistributionComponent>;

  const playlistServiceSpy = jasmine.createSpyObj("PlaylistService", ["getDetailedUserPlaylists"]);
  const trackServiceSpy = jasmine.createSpyObj("TrackService", ["searchTracks"]);

  beforeEach(async () => {
    playlistServiceSpy.getDetailedUserPlaylists.and.returnValue(of([]));
    trackServiceSpy.searchTracks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [TrackDistributionComponent],
      providers: [
        { provide: PlaylistService, useValue: playlistServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
