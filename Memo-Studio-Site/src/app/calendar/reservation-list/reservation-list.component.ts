import { Component, OnInit } from "@angular/core";
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
import { BookingService } from "src/app/shared/services/booking.service";
import { DateTimeService } from "src/app/shared/services/date-time.service";
import { DayService } from "src/app/shared/services/day.service";
declare const $: any;

@Component({
  selector: "app-reservation-list",
  templateUrl: "./reservation-list.component.html",
  styleUrls: ["./reservation-list.component.css"],
})
export class ReservationListComponent implements OnInit {
  public selectedFilter: number = 1;
  public dayConfiguration: Day;
  public bookingForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    phone: new FormControl("", Validators.required),
    duration: new FormControl(30, Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    timestamp: new FormControl(null, [Validators.required]),
    note: new FormControl(""),
  });

  date: Date = new Date();
  bookingsOrigin: Booking[] = [];
  public currentDay: Day;
  bookings: Booking[] = [];
  loader: boolean = false;
  isDayPast: boolean = false;
  isServerDown: boolean = false;
  deleteBookingId: string;
  public noteModal: Booking;

  selectedStartHour: number = 17;
  selectedEndHour: number = 35;
  workingDayAddError: number = -1;
  filteredOptions: Observable<User[]>;
  filteredPhoneOptions: Observable<User[]>;
  filteredEmailOptions: Observable<User[]>;
  selectedPhone: string;
  selectedUserId: string;
  startTime = new Date(0, 0, 0, 8, 0);
  endTime = new Date(0, 0, 0, 18, 0);

  constructor(
    private bookingService: BookingService,
    private dayService: DayService,
    private fb: FormBuilder,
    public dateTimeService: DateTimeService
  ) {}

  ngOnInit(): void {
    this.showBookings(1);
  }

  public showBookings(id: number) {
    this.selectedFilter = id;

    this.bookingService.getBookingsByDate(this.date).subscribe((x) => {
      this.bookingsOrigin = x;
      console.log(x)
      this.dayService.getDayByDate(this.date).subscribe((x) => {
        this.dayConfiguration = x;
        this.bookings = this.getBookingsByBusiness(id);
        this.loader = false;
      });
    });
  }

  //REF
  private getBookingsByBusiness(filterId: number) {
    let bookingsToShow: Booking[] = [];

    if (!this.currentDay || this.currentDay?.isWorking) {
      this.dateTimeService
        .generateTimeSlots(this.startTime, this.endTime, 30)
        .forEach((timeSlot) => {
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
  public checkIfBookingExist(date: Date) {
    return (
      this.bookingsOrigin.findIndex(
        (x) =>
          this.dateTimeService.compareHoursAndMinutes(date, new Date(x.timestamp)) == 0
      ) != -1
    );
  }

  //REF
  private getBookingByTimeSlot(date) {
    let index = this.bookingsOrigin.findIndex(
      (x) => this.dateTimeService.compareHoursAndMinutes(date, new Date(x.timestamp)) == 0
    );

    if (index == -1) {
      return null;
    }

    return this.bookingsOrigin[index];
  }

  public openRemoveBookingConfirmation(id: string) {
    this.deleteBookingId = id;
  }

  public newEvent(preDefinedHour: Date) {
    if (preDefinedHour) {
      this.bookingForm.patchValue({
        timestamp: preDefinedHour,
      });
    }

    this.showHideElement('dialog',true)
    this.showHideElement('dialog2',false)
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
    if (this.selectedStartHour > this.selectedEndHour) {
      this.workingDayAddError = 1;
    } else {
      this.workingDayAddError = -1;

      var startTime = new Date(0, 0, 0);
      var endTime = new Date(0, 0, 0);

      if (this.selectedStartHour % 2 == 0) {
        startTime.setHours(this.selectedStartHour / 2);
      } else {
        startTime.setHours((this.selectedStartHour - 1) / 2);
        startTime.setMinutes(30);
      }
      if (this.selectedEndHour % 2 == 0) {
        endTime.setHours(this.selectedEndHour / 2);
      } else {
        endTime.setHours((this.selectedEndHour - 1) / 2);
        endTime.setMinutes(30);
      }

      this.currentDay = {
        dayDate: this.date,
        startPeriod: startTime,
        endPeriod: endTime,
        isWorking: true,
        employeeId: localStorage.getItem("clientId"),
      };

      this.dayService.addDay(this.currentDay).subscribe((x) => {
        $("#dialog2").hide(250);
        this.showBookings(1);
      });
    }
  }

  public cancelEvent(id: number) {
    if (id == 1) {
      this.bookingForm.reset();
      $("#name").removeClass("error-input");
      $("#count").removeClass("error-input");
      $("#dialog").hide(250);
      $(".events-container").show(250);
    } else {
      $("#dialog2").hide(250);
      $(".events-container").show(250);
    }
  }

  public onOptionSelected(event: any): void {
    var selectedValue: User = event.option.value;
    // this.phoneControl.setValue(selectedValue.phoneNumber);
    // this.nameControl.setValue(selectedValue.name);
    // this.emailControl.setValue(selectedValue.email);
    this.selectedUserId = selectedValue.userId;
  }

  public bookHour() {
    // if (
    //   this.nameControl.value == "" ||
    //   this.phoneControl.value == "" ||
    //   this.emailControl.value == "" ||
    //   this.selectedUserId == "" ||
    //   this.selectedHour == ""
    // ) {
    //   this.raiseError = true;
    //   this.snackBar.open("Моля попълнете всички полета!", "Затвори", {
    //     duration: 8000,
    //     panelClass: ["custom-snackbar"],
    //   });
    //   return;
    // } else {
    //   this.raiseError = false;
    // }
    // let date = this.date;
    // let name = this.nameControl.value.trim();
    // let phone = this.phoneControl.value.trim();
    // let email = this.emailControl.value.trim();
    // let note = this.noteControl.value.trim();
    // let hour = parseInt(this.selectedHour.split(":")[0]);
    // let minutes = parseInt(this.selectedHour.split(":")[1]);
    // $("#dialog").hide(250);
    // let resultOfEmptyHoursCheck = this.checkIfNextHourEmpty(
    //   hour,
    //   minutes,
    //   parseInt(this.selectedDuration.toString())
    // );
    // if (resultOfEmptyHoursCheck == 1) {
    //   this.error = 1;
    //   alert(
    //     "Няма достатъчно свободни часове, моля променете продължителността или часа на резервация"
    //   );
    // } else if (resultOfEmptyHoursCheck == 2) {
    //   this.error = 2;
    //   alert(
    //     "Няма достатъчно свободни часове, моля променете продължителността или часа на резервация"
    //   );
    // } else {
    //   this.error = -1;
    //   let id = this.generateGuidString();
    //   this.newEventJson(
    //     1,
    //     name,
    //     phone,
    //     date,
    //     this.date.getDate(),
    //     hour,
    //     minutes,
    //     note,
    //     email
    //   );
    //   for (let i = 0; i < this.selectedDuration; i++) {
    //     if (minutes == 30) {
    //       hour++;
    //       minutes = 0;
    //     } else {
    //       minutes = 30;
    //     }
    //   }
    //   this.nameControl.setValue("");
    //   this.phoneControl.setValue("");
    //   this.emailControl.setValue("");
    //   this.noteControl.setValue("");
    //   this.selectedPhone = null;
    //   this.selectedHour = null;
    //   this.selectedUserId = null;
    // }
    // date.setDate(this.date.getDate());
    // this.getBookingsByMonthStatistics();
    // this.dateClick(this.date.getDate());
  }

  private showHideElement(elementId, show){
    const elementToToggle = document.querySelector(`#${elementId}`) as HTMLElement;

    if (elementToToggle) {
      if (show) {
        elementToToggle.style.display = 'block';
      } else {
        elementToToggle.style.display = 'none';
      }
    }
  }
}

export enum FilterTypes {
  All = 1,
  Free = 2,
  Bussy = 3,
}
