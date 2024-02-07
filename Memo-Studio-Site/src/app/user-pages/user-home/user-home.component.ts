import { Component, OnInit } from "@angular/core";
import { NavigateService } from "src/app/shared/services/navigate.service";

@Component({
  selector: "app-user-home",
  templateUrl: "./user-home.component.html",
  styleUrls: ["./user-home.component.css"],
})
export class UserHomeComponent {
  // If ID, search for Admin Role, if not Admin redirect User to his home

  constructor(public navigateService: NavigateService) { }
}
