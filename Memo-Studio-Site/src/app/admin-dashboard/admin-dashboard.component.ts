import { Component, OnInit } from "@angular/core";
import { NavigateService } from "../shared/services/navigate.service";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  constructor(public navigateService: NavigateService) { }

  ngOnInit(): void { }
}
