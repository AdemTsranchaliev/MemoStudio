import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
import { Observable } from "rxjs";
import { Booking } from "src/app/shared/models/booking.model";
import { Day } from "src/app/shared/models/day.model";
import { User } from "src/app/shared/models/user.model";
import { AuthenticatinService } from "src/app/shared/services/authenticatin.service";
import { BookingService } from "src/app/shared/services/booking.service";
import { DateTimeService } from "src/app/shared/services/date-time.service";
import { DayService } from "src/app/shared/services/day.service";
declare const $: any;

@Component({
  selector: "app-reservation-list",
  templateUrl: "./reservation-list.component.html",
  styleUrls: ["./reservation-list.component.css"],
})
export class ReservationListComponent implements OnInit, OnChanges {
  @Input() bookingsOrigin: Booking[] = [];
  @Input() facilityConfiguration: any; //set type
  @Input() date: Date = new Date();
  @Output() dateChange: EventEmitter<Date> = new EventEmitter();

  public selectedFilter: number = FilterTypes.All;
  public timeSlots: Date[] = [];

  public bookingForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    phone: new FormControl("", Validators.required),
    duration: new FormControl(30, Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    timestamp: new FormControl(null, [Validators.required]),
    facilityId: new FormControl(null),
    note: new FormControl(""),
  });

  public customDayConfigurationForm: FormGroup = new FormGroup({
    periodStart: new FormControl("", Validators.required),
    periodEnd: new FormControl("", Validators.required),
    interval: new FormControl(30, Validators.required),
  });

  public currentDay: Day;
  bookings: Booking[] = [];
  loader: boolean = false;
  isDayPast: boolean = false;
  isServerDown: boolean = false;
  deleteBookingId: string;
  public noteModal: Booking;

  workingDayAddError: number = -1;
  filteredOptions: Observable<User[]>;
  filteredPhoneOptions: Observable<User[]>;
  filteredEmailOptions: Observable<User[]>;
  selectedPhone: string;
  selectedUserId: string;

  constructor(
    private bookingService: BookingService,
    private dayService: DayService,
    private authService: AuthenticatinService,
    public dateTimeService: DateTimeService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    //Load time slots
    this.timeSlots = this.dateTimeService.generateTimeSlots(
      this.facilityConfiguration?.startPeriod,
      this.facilityConfiguration?.endPeriod,
      this.facilityConfiguration?.interval
    );

    this.showBookings(FilterTypes.All);
  }

  ngOnInit(): void {
    this.showBookings(FilterTypes.All);
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
      var currentDate = new Date(this.date);
      currentDate.setHours(preDefinedHour.getHours());
      currentDate.setMinutes(preDefinedHour.getMinutes());
      currentDate.setSeconds(0);
      this.bookingForm.patchValue({
        timestamp: currentDate,
        facilityId: this.authService.getFacilityId()
      });
    }
    this.showHideElement("customDayConfigurationDialog", false);
    this.showHideElement("bookingDialog", true);
    // $("input").click(function () {
    //   $().removeClass("error-input");
    // });

    // $("#dialog input[type=text]").val("");
    // $("#dialog input[type=number]").val("");
    // $(".events-container").hide(250);
    // $("#dialog2").hide(250);
    // $("#dialog").show(250);
  }

  //REF
  public removeBooking() {
    this.loader = true;

    this.bookingService.deleteBooking(this.deleteBookingId).subscribe((x) => {
      this.bookingsOrigin = this.bookingService.getReservationForDate(
        this.date,
        this.bookingsOrigin
      );
      this.bookings = [...this.bookingsOrigin];
      this.showBookings(FilterTypes.All);

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

  public addDaySpecifications() {
    // if (this.selectedStartHour > this.selectedEndHour) {
    //   this.workingDayAddError = 1;
    // } else {
    //   this.workingDayAddError = -1;
    //   var startTime = new Date(0, 0, 0);
    //   var endTime = new Date(0, 0, 0);
    //   if (this.selectedStartHour % 2 == 0) {
    //     startTime.setHours(this.selectedStartHour / 2);
    //   } else {
    //     startTime.setHours((this.selectedStartHour - 1) / 2);
    //     startTime.setMinutes(30);
    //   }
    //   if (this.selectedEndHour % 2 == 0) {
    //     endTime.setHours(this.selectedEndHour / 2);
    //   } else {
    //     endTime.setHours((this.selectedEndHour - 1) / 2);
    //     endTime.setMinutes(30);
    //   }
    //   this.currentDay = {
    //     dayDate: this.date,
    //     startPeriod: startTime,
    //     endPeriod: endTime,
    //     isWorking: true,
    //     employeeId: localStorage.getItem("clientId"),
    //   };
    //   this.dayService.addDay(this.currentDay).subscribe((x) => {
    //     $("#dialog2").hide(250);
    //     this.showBookings(1);
    //   });
    // }
  }

  public cancelEvent(id: number) {
    this.resetForm(this.bookingForm);
    this.showHideElement("customDayConfigurationDialog", false);
    this.showHideElement("bookingDialog", false);
    // if (id == 1) {
    //   this.bookingForm.reset();
    //   $("#name").removeClass("error-input");
    //   $("#count").removeClass("error-input");
    //   $("#dialog").hide(250);
    //   $(".events-container").show(250);
    // } else {
    //   $("#dialog2").hide(250);
    //   $(".events-container").show(250);
    // }
  }

  public onOptionSelected(event: any): void {
    var selectedValue: User = event.option.value;
    // this.phoneControl.setValue(selectedValue.phoneNumber);
    // this.nameControl.setValue(selectedValue.name);
    // this.emailControl.setValue(selectedValue.email);
    this.selectedUserId = selectedValue.userId;
  }

  public bookHour() {
    let resultOfEmptyHoursCheck = 0
      console.log(this.bookingForm.value)
    if (resultOfEmptyHoursCheck == 1) {
      alert(
        "Няма достатъчно свободни часове, моля променете продължителността или часа на резервация"
      );
    } else if (resultOfEmptyHoursCheck == 2) {
      alert(
        "Няма достатъчно свободни часове, моля променете продължителността или часа на резервация"
      );
    } else {
      this.bookingService.addBooking(this.bookingForm.value).subscribe((x) => {
        this.showHideElement("customDayConfigurationDialog", false);
        this.showHideElement("bookingDialog", false);

        this.resetForm(this.bookingForm);
      });
    }

    this.dateChange.emit(this.date);
  }

  private showHideElement(elementId, show) {
    const elementToToggle = document.querySelector(
      `#${elementId}`
    ) as HTMLElement;

    if (elementToToggle) {
      if (show) {
        elementToToggle.style.display = "block";
      } else {
        elementToToggle.style.display = "none";
      }
    }
  }

  //REF
  private getBookingsByBusiness(filterId: number) {
    let bookingsToShow: Booking[] = [];

    if (!this.currentDay || this.currentDay?.isWorking) {
      this.timeSlots.forEach((timeSlot) => {
        if (
          this.checkIfBookingExist(timeSlot) &&
          (filterId == FilterTypes.All || filterId == FilterTypes.Bussy)
        ) {
          bookingsToShow.push(this.getBookingByTimeSlot(timeSlot));
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

  private checkIfNextHourEmpty(date: Date, interval: number) {
    let index = this.bookings.findIndex(
      (x) =>
        x.timestamp.getHours() == date.getHours() &&
        x.timestamp.getMinutes() == date.getMinutes()
    );

    if (index + interval > this.timeSlots.length) {
      return 2;
    }

    //TODO finish the check for duration
    // for (let i = 0; i < interval; i++) {
    //   if (this.bookings[index]?.id) {
    //     return 1;
    //   }
    //   index++;
    // }

    return 0;
  }
}

export enum FilterTypes {
  All = 1,
  Free = 2,
  Bussy = 3,
}