import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Booking } from "../shared/models/booking.model";

@Component({
  selector: "app-booking-confirmation-list",
  templateUrl: "./booking-confirmation-list.component.html",
  styleUrls: ["./booking-confirmation-list.component.css"],
})
export class BookingConfirmationListComponent implements OnInit {
  notifications: Notification[] = [];
  columndefs: any[] = ["date", "createdOn", "name", "phone", "service", "action"];
  dataSource: MatTableDataSource<TestBooking>;

  constructor() { }

  ngOnInit(): void {
    let bookings: TestBooking[] = [
      new TestBooking(
        1,
        new Date('2023-09-10'),
        new Date(),
        'John Doe',
        '555-555-5555',
        'Haircut',
        true
      ),
      new TestBooking(
        2,
        new Date('2023-09-12'),
        new Date(),
        'Jane Smith',
        '123-456-7890',
        'Massage',
        true
      ),
      new TestBooking(
        3,
        new Date('2023-09-15'),
        new Date(),
        'Bob Johnson',
        '987-654-3210',
        'Manicure',
        true
      ),
    ];

    this.dataSource = new MatTableDataSource(bookings);
  }

  public getRowColor(row: any): string {
    return row.isApproved ? 'primary' : 'warn';
  }

  public getButtonText(row: any): string {
    return row.isApproved ? 'Одобри' : 'Откажи';
  }

  public toggleApproval(row: any): void {
    row.isApproved = !row.isApproved;
  }

  public editUser() { }
}

export class TestBooking {
  public id: number;
  public date: Date;
  public createdOn: Date;
  public name: string;
  public phone: string;
  public service: string;
  public isAproved: boolean;
  constructor(
    id: number,
    date: Date,
    createdOn: Date,
    name: string,
    phone: string,
    service: string,
    isAproved: boolean
  ) {
    this.id = id;
    this.date = date;
    this.createdOn = createdOn;
    this.name = name;
    this.phone = phone;
    this.service = service;
    this.isAproved = isAproved
  }
}
