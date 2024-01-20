import { Component, OnInit } from "@angular/core";
import { BookingService } from "../shared/services/booking.service";
import { DateTimeService } from "../shared/services/date-time.service";
import { DayService } from "../shared/services/day.service";
import { Booking } from "../shared/models/booking.model";
import { Day } from "../shared/models/day.model";
import { FacilityService } from "../shared/services/facility.service";
import { DateCalendar } from "./date.model";
declare const $: any;

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class ReservationCalendarComponent implements OnInit {
  public isPastDate: boolean = false;
  public isServerDown: boolean = false;
  public loader: boolean = false;
  bookingsOrigin: Booking[] = [];
  public currentDay: Day;
  public date: Date = new Date();
  public facilityConfiguration: any;
  public autocompleteNames: [] = [];

  bookings: Booking[] = [];

  constructor(
    private bookingService: BookingService,
    private dayService: DayService,
    private facilityService: FacilityService,
    public dateTimeService: DateTimeService
  ) {}

  ngOnInit(): void {
    this.facilityService.getFacilitySettings().subscribe((x) => {
      this.facilityConfiguration = x;
      this.dateChange(<DateCalendar>{
        date: this.date,
        isPastDate: this.isPastDate,
      });
    });
    this.facilityService.getFacilityUsers().subscribe((x) => {
      this.autocompleteNames = x;
    });
  }

  public dateChange($event) {
    this.date = $event.date;
    this.isPastDate = $event.isPastDate;

    this.bookingService.getBookingsByDate(this.date).subscribe((x) => {
      this.bookingsOrigin = x;
    });
  }

  editDay() {
    $("#customDayConfigurationDialog").show(250);
  }
}
