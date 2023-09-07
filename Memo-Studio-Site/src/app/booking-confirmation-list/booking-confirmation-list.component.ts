import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Booking } from "../models/booking.model";

@Component({
  selector: "app-booking-confirmation-list",
  templateUrl: "./booking-confirmation-list.component.html",
  styleUrls: ["./booking-confirmation-list.component.css"],
})
export class BookingConfirmationListComponent implements OnInit {
  notifications: Notification[] = [];
  columndefs: any[] = ["date", "createdOn", "name", "phone", "service", "accept", "decline"];
  dataSource: MatTableDataSource<TestBooking>;

  constructor() {}

  ngOnInit(): void {
    let bookings: TestBooking[] = [
      new TestBooking(
        1,
        new Date('2023-09-10'),
        new Date(),
        'John Doe',
        '555-555-5555',
        'Haircut'
      ),
      new TestBooking(
        2,
        new Date('2023-09-12'),
        new Date(),
        'Jane Smith',
        '123-456-7890',
        'Massage'
      ),
      new TestBooking(
        3,
        new Date('2023-09-15'),
        new Date(),
        'Bob Johnson',
        '987-654-3210',
        'Manicure'
      ),
    ];

    this.dataSource = new MatTableDataSource(bookings);
  }

  public editUser() {}
}

export class TestBooking {
  public id: number;
  public date: Date;
  public createdOn: Date;
  public name: string;
  public phone: string;
  public service: string;
  constructor(
    id: number,
    date: Date,
    createdOn: Date,
    name: string,
    phone: string,
    service: string
  ) {
    this.id = id;
    this.date = date;
    this.createdOn = createdOn;
    this.name = name;
    this.phone = phone;
    this.service = service;
  }
}
