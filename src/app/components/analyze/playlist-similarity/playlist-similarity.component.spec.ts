import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { PlaylistService } from "src/app/services/playlist.service";
import { TrackService } from "src/app/services/track.service";

import { PlaylistSimilarityComponent } from "./playlist-similarity.component";

describe("PlaylistCompareComponent", () => {
  let component: PlaylistSimilarityComponent;
  let fixture: ComponentFixture<PlaylistSimilarityComponent>;

  const playlistServiceSpy = jasmine.createSpyObj("PlaylistService", ["getUserPlaylists"]);
  const trackServiceSpy = jasmine.createSpyObj("TrackService", ["equal", "contains", "getTracksArtists"]);

  beforeEach(async () => {
    playlistServiceSpy.getUserPlaylists.and.returnValue(of([]));
    trackServiceSpy.equal.and.returnValue(true);
    trackServiceSpy.contains.and.returnValue(true);
    trackServiceSpy.getTracksArtists.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [PlaylistSimilarityComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: PlaylistService, useValue: playlistServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistSimilarityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
