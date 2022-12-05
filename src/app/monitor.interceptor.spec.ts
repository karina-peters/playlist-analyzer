import { TestBed } from '@angular/core/testing';

import { MonitorInterceptor } from './monitor.interceptor';

describe('MonitorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MonitorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MonitorInterceptor = TestBed.inject(MonitorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
