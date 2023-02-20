import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UserService } from "src/app/services/user.service";

import { NavHeaderComponent } from "./nav-header.component";

describe("NavHeaderComponent", () => {
  let component: NavHeaderComponent;
  let fixture: ComponentFixture<NavHeaderComponent>;

  const authServiceSpy = jasmine.createSpyObj("AuthenticationService", ["requestAccess"]);
  const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);

  const userServiceSpy = {
    signIn: () => {},
    user$: new Subject(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavHeaderComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
