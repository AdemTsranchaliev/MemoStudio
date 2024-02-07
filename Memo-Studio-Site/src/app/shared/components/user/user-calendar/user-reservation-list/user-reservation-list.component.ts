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
import * as moment from "moment";
import { Moment } from "moment";
import { Observable } from "rxjs";
import { Booking } from "src/app/shared/models/booking.model";
import { Day } from "src/app/shared/models/day.model";
import { User } from "src/app/shared/models/user.model";
import { AuthenticatinService } from "src/app/shared/services/authenticatin.service";
import { BookingService } from "src/app/shared/services/booking.service";
import { DateTimeService } from "src/app/shared/services/date-time.service";
import { DayService } from "src/app/shared/services/day.service";
import { UtilityService } from "src/app/shared/services/utility.service";
declare const $: any;

@Component({
  selector: "app-user-reservation-list",
  templateUrl: "./user-reservation-list.component.html",
  styleUrls: ["./user-reservation-list.component.css"],
})
export class UserReservationListComponent implements OnInit, OnChanges {
  @Input() bookingsOrigin: Booking[] = [];
  @Input() facilityConfiguration: any; //set type
  @Input() date: Moment = moment.utc();
  @Output() dateChange: EventEmitter<Moment> = new EventEmitter();

  public selectedFilter: number = FilterTypes.All;
  public timeSlots: Moment[] = [];

  public bookingForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    phone: new FormControl("", Validators.required),
    duration: new FormControl(30, Validators.required), // will be removed?
    email: new FormControl("", [Validators.required, Validators.email]),
    timestamp: new FormControl(null, [Validators.required]),
    facilityId: new FormControl(null),
    note: new FormControl(""),
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
    public dateTimeService: DateTimeService,
    public utilityService: UtilityService,
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

  public openBookingDialog(preDefinedHour: Moment) {
    if (preDefinedHour) {
      let currentDate = moment.utc(this.date);
      currentDate.hours(preDefinedHour.hours());
      currentDate.minutes(preDefinedHour.minutes());
      currentDate.seconds(0);
      this.bookingForm.patchValue({
        timestamp: currentDate,
        facilityId: this.authService.getFacilityId(),
      });
    }
    this.showHideElement("bookingDialog", true);
  }

  public openPreviewDialog() {
    if (this.bookingForm.invalid) {
      this.bookingForm.get('name').markAsTouched();
      this.bookingForm.get('phone').markAsTouched();
      this.bookingForm.get('email').markAsTouched();
      return;
    }

    this.showHideElement("previewDialog", true);
  }

  public cancelEvent(condition: string) {
    if (condition == "cancel-set") {
      this.resetForm(this.bookingForm);
      this.showHideElement("bookingDialog", false);
    } else if (condition == "cancel-preview") {
      this.showHideElement("previewDialog", false);
    }
  }

  //REF
  public removeBooking() {
    this.loader = true;

    this.bookingService.deleteBooking(this.deleteBookingId).subscribe((x) => {
      this.dateChange.emit(this.date);

      this.loader = false;
    });
  }

  public cancelDay() {
    
    this.dayService.setHoliday(this.date).subscribe((x) => {
      $("#modalCancel").modal("hide");
      $("#dialog2").hide(250);
      this.showBookings(1);
    });
  }

  public onOptionSelected(event: any): void {
    let selectedValue: User = event.option.value;
    // this.phoneControl.setValue(selectedValue.phoneNumber);
    // this.nameControl.setValue(selectedValue.name);
    // this.emailControl.setValue(selectedValue.email);
    this.selectedUserId = selectedValue.userId;
  }

  public bookHour() {
    let resultOfEmptyHoursCheck = this.checkIfNextHourEmpty(
      new Date(this.bookingForm.get("timestamp").value),
      this.bookingForm.get("duration").value
    );
    if (resultOfEmptyHoursCheck) {
      alert(
        "Няма достатъчно свободни часове за избраната процедура, моля изберете друг час или услуга"
      );
    } else {
      this.bookingService.addBooking(this.bookingForm.value).subscribe((x) => {
        this.showHideElement("previewDialog", false);
        this.showHideElement("bookingDialog", false);

        this.resetForm(this.bookingForm);
        this.dateChange.emit(this.date);
      });
    }
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

    if (!this.currentDay || this.currentDay?.isOpen) {
      let tempDuration = 0;
      let currentBooking;

      this.timeSlots.forEach((timeSlot) => {
        if (
          (this.checkIfBookingExist(timeSlot) &&
            (filterId == FilterTypes.All || filterId == FilterTypes.Bussy)) ||
          tempDuration > 0
        ) {
          let bookingTemp: Booking;

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
          let booking = new Booking();
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
          moment.utc(date),
          moment.utc(x.timestamp)
        ) == 0
    );

    if (index == -1) {
      return null;
    }

    return this.bookingsOrigin[index];
  }
  //REF
  private checkIfBookingExist(date: Moment) {
    return (
      this.bookingsOrigin.findIndex(
        (x) =>
          this.dateTimeService.compareHoursAndMinutes(
            moment.utc(date),
            moment.utc(x.timestamp)
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
    let indexInTimeSlots = this.timeSlots.findIndex(
      (x) => this.dateTimeService.compareHoursAndMinutes(moment.utc(date), moment.utc(x)) == 0
    );
    let timeSlotCountCheck = duration / this.facilityConfiguration.interval;

    if (timeSlotCountCheck > 1) {
      if (timeSlotCountCheck + indexInTimeSlots >= this.timeSlots.length) {
        return true;
      }

      for (
        let i = indexInTimeSlots + 1;
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
}

export enum FilterTypes {
  All = 1,
  Free = 2,
  Bussy = 3,
}
