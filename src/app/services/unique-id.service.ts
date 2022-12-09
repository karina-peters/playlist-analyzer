import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UniqueIdService {
  private static counter = 0;

  constructor() {}

  public getUniqueId(prefix: string) {
    const id = ++UniqueIdService.counter;
    return prefix + id;
  }
}
