import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookingService } from "../../shared/services/booking.service";
import { DateTimeService } from "../../shared/services/date-time.service";
import { DayService } from "../../shared/services/day.service";
import { Booking } from "../../shared/models/booking.model";
import { Day } from "../../shared/models/day.model";
import { FacilityService } from "../../shared/services/facility.service";
import { DateCalendar } from "./date.model";
import { MatDialog } from "@angular/material/dialog";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { Observable, Subscription } from "rxjs";
import { CalendarEditDayComponent } from "src/app/shared/dialogs/calendar-edit-day/calendar-edit-day.component";
declare const $: any;

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class ReservationCalendarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public isPastDate: boolean = false;
  public isServerDown: boolean = false;
  public loader: boolean = false;
  public isOpen: boolean = true;
  bookingsOrigin: Booking[] = [];
  public currentDay: Day;
  public date: Date = new Date();
  public facilityConfiguration: any;
  public autocompleteNames: [] = [];

  bookings: Booking[] = [];

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(
    private bookingService: BookingService,
    private dayService: DayService,
    private facilityService: FacilityService,
    public dateTimeService: DateTimeService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
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

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public dateChange($event) {
    this.date = $event.date;
    this.isPastDate = $event.isPastDate;
    this.bookingService.getBookingListByDate(this.date).subscribe((x) => {
      console.log(x)
      this.bookingsOrigin = x.bookings;
      this.isOpen = x.isOpen;
    });
  }

  public editDay() {
    const dialogRef = this.dialog.open(CalendarEditDayComponent, {
      width: "100vw",
      data: {
        date: this.date,
      },
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        dialogRef.updateSize("90%");
      } else {
        dialogRef.updateSize("50%");
      }
    });
    this.subscriptions.push(smallDialogSubscription);
  }
}
