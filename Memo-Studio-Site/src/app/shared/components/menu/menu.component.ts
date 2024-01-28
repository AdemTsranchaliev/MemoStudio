import { Component, OnInit } from "@angular/core";
import { AuthenticatinService } from "../../services/authenticatin.service";
import { CalendarProfileInformation } from "../../models/account/calendar-profile-information.model";
import { AccountService } from "../../services/account.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  public facilityModel: CalendarProfileInformation;

  constructor(
    public authService: AuthenticatinService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.accountService.getCalendarUserInformation().subscribe((x) => {
      this.facilityModel = x;
    });
  }
}
