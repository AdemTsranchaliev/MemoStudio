import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BookingService } from "../../../../shared/services/booking.service";
import { DateTimeService } from "../../../../shared/services/date-time.service";
import { DayService } from "../../../../shared/services/day.service";
import { Booking } from "../../../../shared/models/booking.model";
import { Day } from "../../../../shared/models/day.model";
import { FacilityService } from "../../../../shared/services/facility.service";
import { Router } from "@angular/router";
declare const $: any;

@Component({
  selector: 'app-user-calendar',
  templateUrl: './user-calendar.component.html',
  styleUrls: ['./user-calendar.component.css']
})
export class UserCalendarComponent implements OnInit {
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
    public dateTimeService: DateTimeService,
    public router: Router,
  ) { }

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

  navigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}