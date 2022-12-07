import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";

export class Alert {
  id: string = "";
  type: AlertType = AlertType.Info;
  message: string = "";
  autoClose: boolean = false;
  keepAfterRouteChange?: boolean = false;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning,
}

@Injectable({
  providedIn: "root",
})
export class AlertService {
  constructor() {}

  private subject = new Subject<Alert>();
  private defaultId = "default-alert";

  // enable subscribing to alerts observable
  public onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter((x) => x && x.id === id));
  }

  public success(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Success, message }));
  }

  public error(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message }));
  }

  public info(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Info, message }));
  }

  public warn(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
  }

  public clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }

  private alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }
}
