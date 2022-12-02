import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlaylistCompareComponent } from "./playlist-similarity.component";

describe("PlaylistCompareComponent", () => {
  let component: PlaylistCompareComponent;
  let fixture: ComponentFixture<PlaylistCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaylistCompareComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
