import { Component, OnInit, OnDestroy } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { CalendarProfileInformation } from "../../models/account/calendar-profile-information.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-business-card-calendar",
  templateUrl: "./business-card-calendar.component.html",
  styleUrls: ["./business-card-calendar.component.css"],
})
export class BusinessCardCalendarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public facilityModel: CalendarProfileInformation;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getCalendarUserInformation().subscribe((x) => {
      this.facilityModel = x;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }
}
