import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlaylistSimilarityComponent } from "./playlist-similarity.component";

describe("PlaylistCompareComponent", () => {
  let component: PlaylistSimilarityComponent;
  let fixture: ComponentFixture<PlaylistSimilarityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaylistSimilarityComponent],
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
