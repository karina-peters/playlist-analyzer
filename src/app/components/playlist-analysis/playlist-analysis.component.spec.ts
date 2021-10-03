import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistAnalysisComponent } from './playlist-analysis.component';

describe('PlaylistAnalysisComponent', () => {
  let component: PlaylistAnalysisComponent;
  let fixture: ComponentFixture<PlaylistAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
