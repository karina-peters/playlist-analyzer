import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { MonitorInterceptor } from "./monitor.interceptor";

describe("MonitorInterceptor", () => {
  const httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [MonitorInterceptor, { provide: HttpClient, useValue: httpClientSpy }],
    })
  );

  it("should be created", () => {
    const interceptor: MonitorInterceptor = TestBed.inject(MonitorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
