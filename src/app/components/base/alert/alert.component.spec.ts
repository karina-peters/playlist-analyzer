import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";

import { AlertComponent } from "./alert.component";

describe("AlertComponent", () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  const alertServiceSpy = jasmine.createSpyObj("AlertService", ["onAlert", "clear"]);
  const routerSpy = {
    navigateByUrl: () => {},
    events: new Observable(),
  };

  beforeEach(async () => {
    alertServiceSpy.onAlert.and.returnValue(of());

    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
