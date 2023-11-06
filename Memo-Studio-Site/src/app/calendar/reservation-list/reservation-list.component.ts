import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { Booking } from "src/app/shared/models/booking.model";
import { Day } from "src/app/shared/models/day.model";
import { User } from "src/app/shared/models/user.model";
import { BookingService } from "src/app/shared/services/booking.service";
import { DayService } from "src/app/shared/services/day.service";
declare const $: any;

@Component({
  selector: "app-reservation-list",
  templateUrl: "./reservation-list.component.html",
  styleUrls: ["./reservation-list.component.css"],
})
export class ReservationListComponent implements OnInit {
  selectedFilter: number = 1;
  date: Date = new Date();
  bookingsOrigin: Booking[] = [];
  public currentDay: Day;
  bookings: Booking[] = [];
  loader: boolean = false;
  isDayPast: boolean = false;
  isServerDown: boolean = false;
  deleteBookingId: string;
  selectedHour: string;
  public noteModal: Booking;
  nameControl = new FormControl("");
  phoneControl = new FormControl("");
  emailControl = new FormControl("");
  noteControl = new FormControl("");
  selectedStartHour: number = 17;
  selectedEndHour: number = 35;
  workingDayAddError: number = -1;
  filteredOptions: Observable<User[]>;
  filteredPhoneOptions: Observable<User[]>;
  filteredEmailOptions: Observable<User[]>;
  selectedPhone: string;
  selectedUserId: string;
  public selectedDuration: number = 1;
  startTime = new Date(0,0,0,8,0);
  endTime = new Date(0,0,0,8,0);

  public showBookings(id: number) {
    this.selectedFilter = id;

    this.bookingService.getBookingsByDate(this.date).subscribe((x) => {
      this.bookingsOrigin = x;

      this.dayService.getDayByDate(this.date).subscribe((x) => {
        this.currentDay = x;
        this.bookings = this.getBookingsByBusiness(id);
        this.loader = false;
      });
    });
  }

  constructor(
    private bookingService: BookingService,
    private dayService: DayService
  ) {}

  ngOnInit(): void {
    this.showBookings(1);
  }

  private getBookingsByBusiness(id: number) {
    let temp: Booking[] = [];
    if (!this.currentDay || this.currentDay?.isWorking) {
      this.generateTimes(
        new Date(0, 0, 0, 8, 0),
        new Date(0, 0, 0, 18, 0),
        30
      ).forEach((x) => {
        if (this.checkIfBookingExist(x) && (id == 1 || id == 3)) {
          temp.push(this.getBooking(x));
        } else if (
          !this.checkIfBookingExist(x) &&
          (id == 1 || id == 2) &&
          !this.isDayPast
        ) {
          let freeBook: Booking = {
            id: -1,
            bookingId: "",
            timestamp: x,
            createdOn: new Date(),
            canceled: false,
            note: "",
            name: "Свободен",
            email: "",
            phone: "",
            confirmed: false,
            registeredUser: false,
            duration: 0,
          };
          temp.push(freeBook);
        }
      });
    }
    return temp;
  }

  public generateTimes(
    startDate: Date,
    endDate: Date,
    intervalMinutes: number
  ): Date[] {
    const times: Date[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    while (start <= end) {
      times.push(new Date(start)); // Create a new Date object to avoid modifying the original
      start.setMinutes(start.getMinutes() + intervalMinutes);
    }

    return times;
  }

  public checkIfBookingExist(hour) {
    console.log(hour)
    return (
      this.bookingsOrigin.findIndex((x) => {
        const date = new Date(x.timestamp);

        const hoursStr = String(date.getHours());
        const hoursPad = hoursStr.padStart(2, "0");

        const minutesStr = String(date.getUTCMinutes());
        const minutesPad = minutesStr.padStart(2, "0");

        var ttt = hour == this.getHour(hoursPad, minutesPad);

        return ttt;
      }) != -1
    );
  }

  public getHour(hour: string, minutes: string) {
    return `${hour.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }
  private getBooking(hour) {
    let index = this.bookingsOrigin.findIndex((x) => {
      const date = new Date(x.timestamp);

      const hoursStr = String(date.getHours());
      const hoursPad = hoursStr.padStart(2, "0");

      const minutesStr = String(date.getUTCMinutes());
      const minutesPad = minutesStr.padStart(2, "0");

      return hour == this.getHour(hoursPad, minutesPad);
    });

    return this.bookingsOrigin[index];
  }
  truncateText(text: string, limit: number): string {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  }

  public openRemoveBookingConfirmation(id: string) {
    this.deleteBookingId = id;
  }

  public newEvent(preDefinedHour: string) {
    if (preDefinedHour != null) {
      this.selectedHour = preDefinedHour;
    }

    $("input").click(function () {
      $().removeClass("error-input");
    });

    $("#dialog input[type=text]").val("");
    $("#dialog input[type=number]").val("");
    $(".events-container").hide(250);
    $("#dialog2").hide(250);
    $("#dialog").show(250);
  }

  public removeBooking() {
    this.loader = true;
    this.bookingService.deleteBooking(this.deleteBookingId).subscribe((x) => {
      this.bookingsOrigin = this.bookingService.getReservationForDate(
        this.date,
        this.bookingsOrigin
      );
      this.bookings = [...this.bookingsOrigin];
      this.showBookings(1);
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
      this.nameControl.setValue("");
      this.phoneControl.setValue("");
      this.emailControl.setValue("");
      this.noteControl.setValue("");
      this.selectedPhone = null;
      this.selectedHour = null;
      $("#name").removeClass("error-input");
      $("#count").removeClass("error-input");
      $("#dialog").hide(250);
      $(".events-container").show(250);
    } else {
      $("#dialog2").hide(250);
      $(".events-container").show(250);
    }
  }
  loadInputUnderline() {
    return "border-primary";
  }
  public onOptionSelected(event: any): void {
    var selectedValue: User = event.option.value;
    this.phoneControl.setValue(selectedValue.phoneNumber);
    this.nameControl.setValue(selectedValue.name);
    this.emailControl.setValue(selectedValue.email);
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
}
