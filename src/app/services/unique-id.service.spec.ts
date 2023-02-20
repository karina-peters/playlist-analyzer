import { TestBed } from "@angular/core/testing";

import { UniqueIdService } from "./unique-id.service";

describe("UniqueIdService", () => {
  let service: UniqueIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniqueIdService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getUniqueId", () => {
    it("should return unique id", () => {
      expect(service.getUniqueId("test-")).toEqual("test-1");
      expect(service.getUniqueId("test-")).toEqual("test-2");
      expect(service.getUniqueId("test-")).toEqual("test-3");
    });
  });
});
