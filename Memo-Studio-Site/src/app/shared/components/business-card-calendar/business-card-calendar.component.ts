import { Component, OnInit } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { CalendarProfileInformation } from "src/app/profile/general/general.component";

@Component({
  selector: "app-business-card-calendar",
  templateUrl: "./business-card-calendar.component.html",
  styleUrls: ["./business-card-calendar.component.css"],
})
export class BusinessCardCalendarComponent implements OnInit {
  public facilityModel: CalendarProfileInformation;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getCalendarUserInformation().subscribe((x) => {
      this.facilityModel = x;
    });
  }
}
