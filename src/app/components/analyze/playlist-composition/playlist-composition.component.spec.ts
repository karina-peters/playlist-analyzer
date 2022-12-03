import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlaylistCompositionComponent } from "./playlist-composition.component";

describe("PlaylistAnalysisComponent", () => {
  let component: PlaylistCompositionComponent;
  let fixture: ComponentFixture<PlaylistCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaylistCompositionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
