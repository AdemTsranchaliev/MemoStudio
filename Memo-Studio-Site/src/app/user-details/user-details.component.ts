import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Booking } from "../models/booking.model";
import { User } from "../models/user.model";
import { BookingService } from "../shared/services/booking.service";
import { UserService } from "../shared/services/user.service";
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {
  user: User;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = [];
  bookings: Booking[] = [];
  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];

    this.userService.getUser(id).subscribe((x) => {
      this.user = x;
    });
    this.bookingService.getBookingByUserId(id).subscribe((x) => {
      this.dataSource = x;
    });
  }

  public editUser() {}
}
