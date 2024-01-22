import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription, of } from "rxjs";
import { ReservationListBookHourComponent } from "src/app/shared/dialogs/reservation-list-book-hour/reservation-list-book-hour.component";
import { Booking } from "src/app/shared/models/booking.model";
import { Day } from "src/app/shared/models/day.model";
import { AuthenticatinService } from "src/app/shared/services/authenticatin.service";
import { BookingService } from "src/app/shared/services/booking.service";
import { DateTimeService } from "src/app/shared/services/date-time.service";
import { DayService } from "src/app/shared/services/day.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { DateCalendar } from "../date.model";
import { DatePipe } from "@angular/common";
import { CalendarEditDataSharingService } from "src/app/shared/dialogs/calendar-edit-day/calendar-edit-data-sharing.service";
declare const $: any;

@Component({
  selector: "app-reservation-list",
  templateUrl: "./reservation-list.component.html",
  styleUrls: ["./reservation-list.component.css"],
})
export class ReservationListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() bookingsOrigin: Booking[] = [];
  @Input() facilityConfiguration: any; //set type
  @Input() autocompleteNames: [] = [];
  @Input() date: Date = new Date();
  @Input() isDayPast: boolean;
  @Output() dateChange: EventEmitter<DateCalendar> = new EventEmitter();

  private subscriptions: Subscription[] = [];

  public selectedFilter: number = FilterTypes.All;
  public timeSlots: Date[] = [];
  options: any[] = [];

  durationArr: any[] = [
    { duration: "30", value: 30 },
    { duration: "1", value: 60 },
    { duration: "1:30", value: 90 },
    { duration: "2", value: 120 },
    { duration: "2:20", value: 150 },
    { duration: "3", value: 180 },
  ];

  public bookingForm: FormGroup = this.formBuilder.group({
    name: ["", Validators.required],
    phone: ["", Validators.required],
    duration: [30, Validators.required],
    email: ["", [, Validators.email, Validators.required]],
    timestamp: [null, Validators.required],
    serviceCategory: ["", Validators.required],
    facilityId: [null, Validators.required],
    note: [""],
  });

  public currentDay: Day;
  bookings: Booking[] = [];
  loader: boolean = false;
  isServerDown: boolean = false;
  deleteBookingId: string;
  public noteModal: Booking;

  workingDayAddError: number = -1;
  filteredOptions: Observable<any[]>;
  filteredPhoneOptions: Observable<any[]>;
  filteredEmailOptions: Observable<any[]>;
  selectedPhone: string;

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(
    private bookingService: BookingService,
    private dayService: DayService,
    private authService: AuthenticatinService,
    public dateTimeService: DateTimeService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    public utilityService: UtilityService,
    private dataSharingService: CalendarEditDataSharingService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private datePipe: DatePipe,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Load time slots
    this.timeSlots = this.dateTimeService.generateTimeSlots(
      this.facilityConfiguration?.startPeriod,
      this.facilityConfiguration?.endPeriod,
      this.facilityConfiguration?.interval
    );
    this.updateDataEditCalendar();

    this.filteredOptions = of(this.autocompleteNames);
    this.filteredPhoneOptions = of(this.autocompleteNames);
    this.filteredEmailOptions = of(this.autocompleteNames);
    this.showBookings(FilterTypes.All);
  }

  ngOnInit(): void {
    this.showBookings(FilterTypes.All);

    this.userService.getAllUsers().subscribe((x) => {
      this.options = x;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public showBookings(id: number) {
    this.selectedFilter = id;

    this.dayService.getDayByDate(this.date).subscribe((x) => {
      if (x) {
        //TODO: SET DAY
      }
      this.bookings = this.getBookingsByBusiness(id);
    });
  }

  public openRemoveBookingConfirmation(id: string) {
    this.deleteBookingId = id;
  }

  public openBookingDialog(preDefinedHour: Date) {
    if (preDefinedHour) {
      const formattedTimestamp = this.datePipe.transform(preDefinedHour, 'HH:mm');

      this.bookingForm.patchValue({
        timestamp: formattedTimestamp,
        facilityId: this.authService.getFacilityId(),
        duration: 30,
      });
    }

    this.openAddNewHourDialog();
  }

  //REF
  public removeBooking() {
    this.loader = true;

    this.bookingService.deleteBooking(this.deleteBookingId).subscribe((x) => {
      this.dateChange.emit(<DateCalendar>{
        date: this.date,
        isPastDate: false,
      });

      this.loader = false;
    });
  }

  public cancelDay() {
    if (this.currentDay && this.currentDay.dayDate) {
      this.currentDay.isWorking = false;
    } else {
      this.currentDay = {
        dayDate: this.date,
        startPeriod: new Date(),
        endPeriod: new Date(),
        isWorking: false,
        employeeId: localStorage.getItem("clientId"),
      };
    }

    this.dayService.setHoliday(this.currentDay).subscribe((x) => {
      $("#modalCancel").modal("hide");
      $("#dialog2").hide(250);
      this.showBookings(1);
    });
  }

  public truncateText(text: string, limit: number): string {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  }

  public bookHour(currentForm) {
    let resultOfEmptyHoursCheck = this.checkIfNextHourEmpty(
      new Date(this.bookingForm.get("timestamp").value),
      this.bookingForm.get("duration").value
    );
    if (resultOfEmptyHoursCheck) {
      alert(
        "Няма достатъчно свободни часове за избраната процедура, моля изберете друг час или услуга"
      );
    } else {
      let data = Object.assign({}, currentForm.value);
      data.serviceId = currentForm.value.serviceCategory;
      this.bookingService.addBooking(data).subscribe((x) => {
        this.resetForm(this.bookingForm);
        this.dateChange.emit(<DateCalendar>{
          date: this.date,
          isPastDate: false,
        });
      });
    }
  }

  //REF
  private getBookingsByBusiness(filterId: number) {
    let bookingsToShow: Booking[] = [];

    if (!this.currentDay || this.currentDay?.isWorking) {
      var tempDuration = 0;
      var currentBooking;

      this.timeSlots.forEach((timeSlot) => {
        if (
          (this.checkIfBookingExist(timeSlot) &&
            (filterId == FilterTypes.All || filterId == FilterTypes.Bussy)) ||
          tempDuration > 0
        ) {
          var bookingTemp: Booking;

          if (tempDuration > 0) {
            bookingTemp = { ...currentBooking };
          } else {
            bookingTemp = { ...this.getBookingByTimeSlot(timeSlot) };
          }

          if (tempDuration == 0 && bookingTemp) {
            tempDuration =
              bookingTemp.duration - this.facilityConfiguration.interval;
            currentBooking = bookingTemp;
          } else {
            tempDuration = tempDuration - this.facilityConfiguration.interval;
          }
          bookingTemp.timestamp = timeSlot;
          bookingsToShow.push(bookingTemp);
        } else if (
          !this.checkIfBookingExist(timeSlot) &&
          (filterId == FilterTypes.All || filterId == FilterTypes.Free) &&
          !this.isDayPast
        ) {
          var booking = new Booking();
          booking.timestamp = timeSlot;
          bookingsToShow.push(booking);
        }
      });
    }
    return bookingsToShow;
  }

  //REF
  private getBookingByTimeSlot(date) {
    let index = this.bookingsOrigin.findIndex(
      (x) =>
        this.dateTimeService.compareHoursAndMinutes(
          date,
          new Date(x.timestamp)
        ) == 0
    );

    if (index == -1) {
      return null;
    }

    return this.bookingsOrigin[index];
  }
  //REF
  private checkIfBookingExist(date: Date) {
    return (
      this.bookingsOrigin.findIndex(
        (x) =>
          this.dateTimeService.compareHoursAndMinutes(
            date,
            new Date(x.timestamp)
          ) == 0
      ) != -1
    );
  }

  private resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      form.controls[key].setErrors(null);
    });
  }

  private checkIfNextHourEmpty(date: Date, duration: number) {
    var indexInTimeSlots = this.timeSlots.findIndex(
      (x) => this.dateTimeService.compareHoursAndMinutes(date, x) == 0
    );
    var timeSlotCountCheck = duration / this.facilityConfiguration.interval;

    if (timeSlotCountCheck > 1) {
      if (timeSlotCountCheck + indexInTimeSlots >= this.timeSlots.length) {
        return true;
      }

      for (
        var i = indexInTimeSlots + 1;
        i < indexInTimeSlots + timeSlotCountCheck;
        i++
      ) {
        if (this.checkIfBookingExist(this.timeSlots[i])) {
          return true;
        }
      }
    }

    return false;
  }

  openAddNewHourDialog() {
    const dialogRef = this.dialog.open(ReservationListBookHourComponent, {
      width: "100vw",
      data: {
        date: this.date,
        bookingForm: this.bookingForm,
        filteredOptions: this.filteredOptions,
        filteredPhoneOptions: this.filteredPhoneOptions,
        filteredEmailOptions: this.filteredEmailOptions,
        bookings: this.bookings,
        durationArr: this.durationArr,
        options: this.options,
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.bookingForm) {
        this.bookHour(result.bookingForm);
      }
    });
  }

  updateDataEditCalendar(): void {
    this.dataSharingService.updateData(this.timeSlots);
  }
}

export enum FilterTypes {
  All = 1,
  Free = 2,
  Bussy = 3,
}
