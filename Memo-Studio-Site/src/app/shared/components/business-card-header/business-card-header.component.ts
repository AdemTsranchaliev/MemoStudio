import { Component, OnInit, OnDestroy } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { CalendarProfileInformation } from "../../models/account/calendar-profile-information.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-business-card-header",
  templateUrl: "./business-card-header.component.html",
  styleUrls: ["./business-card-header.component.css"],
})
export class BusinessCardHeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public facilityModel: CalendarProfileInformation;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    const userSubscription = this.accountService
      .getCalendarUserInformation()
      .subscribe((x) => {
        this.facilityModel = x;
      });
    this.subscriptions.push(userSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }
}
