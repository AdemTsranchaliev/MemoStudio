import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-home",
  templateUrl: "./user-home.component.html",
  styleUrls: ["./user-home.component.css"],
})
export class UserHomeComponent {
  // If ID, search for Admin Role, if not Admin redirect User to his home

  constructor(private router: Router) {}

  public navigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}