import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";

import { Alert, AlertType, AlertService } from "src/app/services/alert.service";

@Component({
  selector: "app-alert",
  templateUrl: "alert.component.html",
  styleUrls: ["./alert.component.scss"],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = "default-alert";

  public alerts: Alert[] = [];
  public AlertType = AlertType;
  private alertSubscription: Subscription = new Subscription();
  private routeSubscription: Subscription = new Subscription();

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    // Subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert(this.id).subscribe((alert) => {
      if (!alert.message) {
        this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange);
        this.alerts.forEach((x) => delete x.keepAfterRouteChange);
        return;
      }

      this.alerts.push(alert);

      if (alert.autoClose) {
        setTimeout(() => this.removeAlert(alert), 5000);
      }
    });

    // Clear alerts on location change
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  public removeAlert(alert: Alert) {
    if (!this.alerts.includes(alert)) {
      return;
    }

    this.alerts = this.alerts.filter((x) => x !== alert);
  }

  public cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    const classes = ["alert", "alert-dismissable"];

    const alertTypeClass = {
      [AlertType.Success]: "alert alert-success",
      [AlertType.Error]: "alert alert-danger",
      [AlertType.Info]: "alert alert-info",
      [AlertType.Warning]: "alert alert-warning",
    };

    classes.push(alertTypeClass[alert.type]);

    return classes.join(" ");
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
