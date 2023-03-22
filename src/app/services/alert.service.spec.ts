import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Subject } from "rxjs";

import { Alert, AlertService } from "./alert.service";

describe("AlertService", () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("alerts", () => {
    it("should alert success", () => {
      const id = "alert-success";

      service.onAlert(id).subscribe((alert: Alert) => {
        expect(alert.id).toEqual(id);
      });

      service.success("test success", { id: id });
    });

    it("should alert error", () => {
      const id = "alert-error";

      service.onAlert(id).subscribe((alert: Alert) => {
        expect(alert.id).toEqual(id);
      });

      service.error("test error", { id: id });
    });

    it("should alert info", () => {
      const id = "alert-info";

      service.onAlert(id).subscribe((alert: Alert) => {
        expect(alert.id).toEqual(id);
      });

      service.info("test info", { id: id });
    });

    it("should alert warn", () => {
      const id = "alert-warn";

      service.onAlert(id).subscribe((alert: Alert) => {
        expect(alert.id).toEqual(id);
      });

      service.warn("test warn", { id: id });
    });
  });

  describe("clear", () => {
    it("should clear alert with no id", () => {
      let count = 0;

      service.onAlert().subscribe((alert: Alert) => {
        expect(alert.message).toEqual(count == 0 ? "test default" : "");
        ++count;
      });

      service.success("test default");
      service.clear();
    });

    it("should clear alert with id", () => {
      let count = 0;

      service.onAlert().subscribe((alert: Alert) => {
        expect(alert.message).toEqual(count == 0 ? "test default" : "");
        ++count;
      });

      service.success("test default", { id: "test-id" });
      service.clear("test-id");
    });
  });
});
