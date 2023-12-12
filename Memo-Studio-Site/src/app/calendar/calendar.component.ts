import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BookingService } from "../shared/services/booking.service";
import { DateTimeService } from "../shared/services/date-time.service";
import { DayService } from "../shared/services/day.service";
import { Booking } from "../shared/models/booking.model";
import { Day } from "../shared/models/day.model";
import { FacilityService } from "../shared/services/facility.service";
declare const $: any;

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class ReservationCalendarComponent implements OnInit {
  public isDayPast: boolean = false;
  public isServerDown: boolean = false;
  public loader: boolean = false;
  bookingsOrigin: Booking[] = [];
  public currentDay: Day;
  public date: Date = new Date();
  public facilityConfiguration: any;

  bookings: Booking[] = [];

  constructor(
    private bookingService: BookingService,
    private dayService: DayService,
    private facilityService: FacilityService,
    private fb: FormBuilder,
    public dateTimeService: DateTimeService
  ) {}

  ngOnInit(): void {
    this.facilityService.getFacilitySettings().subscribe((x) => {
      this.facilityConfiguration = x;
      this.dateChange(this.date);
    });
  }

  public dateChange(date) {
    this.date = date;

    this.bookingService.getBookingsByDate(this.date).subscribe((x) => {
      this.bookingsOrigin = x;
    });
  }

  editDay() {
    $("#customDayConfigurationDialog").show(250);
  }
}
