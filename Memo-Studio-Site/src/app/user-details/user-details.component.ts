import { Component, OnInit } from "@angular/core";
import { User } from "../models/user.model";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {
  user: User = {
    id: "",
    phoneNumber: "0892609802",
    viberId: "",
    name: "Адем Црънчалиев",
  };
  constructor() {}

  ngOnInit(): void {}

  public editUser() {}
}
