import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDistributionComponent } from './track-distribution.component';

describe('TrackDistributionComponent', () => {
  let component: TrackDistributionComponent;
  let fixture: ComponentFixture<TrackDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
