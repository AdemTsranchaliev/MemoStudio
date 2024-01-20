import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-pre-booking",
  templateUrl: "./pre-booking.component.html",
  styleUrls: ["./pre-booking.component.css"],
})
export class PreBookingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}
