import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user.model";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {
  notifications: Notification[] = [];
  columndefs: any[] = ["sentOn", "type", "status", "service"];
  dataSource: MatTableDataSource<Notification>;

  constructor() {}

  ngOnInit(): void {
    this.notifications = [
      new Notification(new Date(), "Viber", "Received", "Среща"),
      new Notification(new Date(), "Email", "Sent", "Подстрижка"),
      new Notification(new Date(), "Viber", "Seen", "Среща"),
    ];

    this.dataSource = new MatTableDataSource(this.notifications);
  }

  public editUser() {}
}

export class Notification {
  constructor(sentOn: Date, type: string, status: string, service: string) {
    this.sentOn = sentOn;
    this.type = type;
    this.status = status;
    this.service = service;
  }
  public sentOn: Date;
  public type: string;
  public status: string;
  public service: string;
}
