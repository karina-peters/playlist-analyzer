import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDistributeComponent } from './track-distribute.component';

describe('TrackDistributeComponent', () => {
  let component: TrackDistributeComponent;
  let fixture: ComponentFixture<TrackDistributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackDistributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDistributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
