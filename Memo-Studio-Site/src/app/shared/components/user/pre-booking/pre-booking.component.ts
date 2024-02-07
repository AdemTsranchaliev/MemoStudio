import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavigateService } from "src/app/shared/services/navigate.service";

@Component({
  selector: "app-pre-booking",
  templateUrl: "./pre-booking.component.html",
  styleUrls: ["./pre-booking.component.css"],
})
export class PreBookingComponent implements OnInit {
  constructor(public navigateService: NavigateService) {}

  ngOnInit(): void {}
}
