import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { PlaylistService } from "src/app/services/playlist.service";
import { TrackService } from "src/app/services/track.service";

import { TrackDistributeComponent } from "./distribute-tracks.component";

describe("TrackDistributeComponent", () => {
  let component: TrackDistributeComponent;
  let fixture: ComponentFixture<TrackDistributeComponent>;

  const playlistServiceSpy = jasmine.createSpyObj("PlaylistService", ["getDetailedUserPlaylists"]);
  const trackServiceSpy = jasmine.createSpyObj("TrackService", ["getTracks", "checkSavedTracks"]);

  beforeEach(async () => {
    playlistServiceSpy.getDetailedUserPlaylists.and.returnValue(of([]));
    trackServiceSpy.getTracks.and.returnValue(of([]));
    trackServiceSpy.checkSavedTracks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [TrackDistributeComponent],
      providers: [
        { provide: PlaylistService, useValue: playlistServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDistributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
