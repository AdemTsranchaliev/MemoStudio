import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { Booking } from "../shared/models/booking.model";
import { startWith, map, concatMap } from "rxjs/operators";
import { BookingService } from "../shared/services/booking.service";
import { User } from "../shared/models/user.model";
import { Day } from "../shared/models/day.model";
import { BASE_URL_PROD } from "../shared/routes";
import { UserService } from "../shared/services/user.service";
import { DayService } from "../shared/services/day.service";
import { ServerStatusService } from "../shared/services/serverStatus.service";
import { AuthenticatinService } from "../shared/services/authenticatin.service";
import { DayStausEnum } from "../shared/models/dayStatus.model";
import { MonthStatistics } from "../shared/models/booking/month-statistics.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AccountService } from "../shared/services/account.service";
declare const $: any;

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.css"],
})
export class BookingComponent implements OnInit {
  // Subscriptions
  private subscriptions: Subscription[] = [];
  // Week Days for Calendar
  public readonly weekDays: string[] = [
    "Нд",
    "Пн",
    "Вт",
    "Ср",
    "Чт",
    "Пт",
    "Сб",
  ];
  public readonly monthStrings: string[] = [
    "Яну",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Юни",
    "Юли",
    "Авг",
    "Сеп",
    "Окт",
    "Ное",
    "Дек",
  ];
  // Current Date
  private currentDate: Date = new Date();

  // Days Colection
  private calendarDays: Date[] = [];

  // Storage for Event of the Day
  events: { [key: string]: string[] } = {};

  selectedStartHour: number = 17;
  selectedEndHour: number = 35;
  workingDayAddError: number = -1;

  loader: boolean = false;
  isAddClicked = false;
  selectedHour: string;
  selectedPhone: string;

  nameControl = new FormControl("");
  phoneControl = new FormControl("");
  emailControl = new FormControl("");
  noteControl = new FormControl("");

  options: User[] = [];
  selectedUserId: string;
  selectedFilter: number = 1;

  deleteBookingId: string;
  filteredOptions: Observable<User[]>;
  filteredPhoneOptions: Observable<User[]>;
  filteredEmailOptions: Observable<User[]>;
  public error: number = -1;
  public selectedDuration: number = 1;
  public date = new Date();
  public currentDay: Day;
  public bookings: Booking[] = [];
  public bookingsOrigin: Booking[] = [];
  public days: number[] = [];
  public dayCount: number = 0;
  public firstDay: number = 0;
  public noteModal: Booking;
  public raiseError: boolean = false;
  public isDayPast: boolean = false;
  public calendarRows = [];
  public year: number = new Date().getFullYear();
  public isServerDown: boolean = false; // need to adjust in ngOnInit
  public monthStatistics: MonthStatistics[] = [];
  public monthClicked: number = new Date().getMonth() + 1;

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private authService: AuthenticatinService,
    private dayService: DayService, // private bookingViewService: BookingViewService
    private serverStatusService: ServerStatusService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Check server status
    // this.serverStatusService.checkServerStatus().subscribe(
    //   () => {
    //     // Server is up, continue with initialization
    //     this.monthClick(this.date.getMonth());
    //     this.dateClick(this.date.getDate());
    //     this.InitDropdownFilters();
    //     this.isServerDown = false;
    //   },
    //   (error) => {
    //     this.isServerDown = true;
    //     console.error("Server is down:", error);
    //   }
    // );

    this.userService.getAllUsers().subscribe((x) => {
      this.options = x;
    });

    this.monthClick(this.date.getMonth());
    this.dateClick(this.date.getDate());

    this.InitDropdownFilters();
    this.getBookingsByMonthStatistics();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public onOptionSelected(event: any): void {
    var selectedValue: User = event.option.value;
    this.phoneControl.setValue(selectedValue.phoneNumber);
    this.nameControl.setValue(selectedValue.name);
    this.emailControl.setValue(selectedValue.email);
    this.selectedUserId = selectedValue.userId;
  }

  public initCalendar(date: Date): void {
    this.calendarRows = [];
    let tempDate = date.getDate();
    const month = date.getMonth();
    this.year = date.getFullYear();
    this.dayCount = this.daysInMonth(month, this.year);

    date.setDate(1);

    this.firstDay = date.getDay();
    this.date.setDate(tempDate);

    const firstDayOfMonth = new Date(this.year, month);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const startingDay = dayNames[firstDayOfMonth.getDay()];

    // Calculate the number of filler objects to add based on the starting day
    let fillerCount = 0;
    if (startingDay !== "Sunday") {
      fillerCount = dayNames.indexOf(startingDay);
    }

    while (this.monthStatistics.length > 0) {
      const currentRow = this.monthStatistics.splice(0, 7 - fillerCount); // Adjust the row length
      for (let i = 0; i < fillerCount; i++) {
        currentRow.unshift({ day: -1, status: 6 }); // Add filler objects to the beginning of the row
      }

      // Check if the last row needs fillers
      if (this.monthStatistics.length === 0 && currentRow.length < 7) {
        const remainingCount = 7 - currentRow.length;
        for (let i = 0; i < remainingCount; i++) {
          currentRow.push({ day: -1, status: 6 }); // Add fillers to the end of the last row
        }
      }

      this.calendarRows.push(currentRow);

      // Set fillerCount to 0 after adding fillers for the first row
      fillerCount = 0;
    }

    this.dateClick(this.date.getDate());
    setTimeout(() => {
      this.markPastDates();
    }, 1);
    this.showBookings(1);
  }

  public dateClick(day: number) {
    this.date.setDate(day);
    this.showEventContainer();
    this.showBookings(1);
  }

  public monthClick(month: number) {
    this.showEventContainer();
    this.date.setMonth(month);
    this.monthClicked = month + 1;
    this.getBookingsByMonthStatistics();
  }

  public nextYear() {
    this.hideDialogs();
    const newYear = this.date.getFullYear() + 1;
    this.year = newYear;
    this.date.setFullYear(newYear);
    this.getBookingsByMonthStatistics();
  }

  public prevYear() {
    this.hideDialogs();
    const newYear = this.date.getFullYear() - 1;
    this.year = newYear;
    this.date.setFullYear(newYear);
    this.getBookingsByMonthStatistics();
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

  public editDay() {
    $("#dialog2").show(250);
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

  public openRemoveBookingConfirmation(id: string) {
    this.deleteBookingId = id;
  }

  public bookHour() {
    if (
      this.nameControl.value == "" ||
      this.phoneControl.value == "" ||
      this.emailControl.value == "" ||
      this.selectedUserId == "" ||
      this.selectedHour == ""
    ) {
      this.raiseError = true;
      this.snackBar.open("Моля попълнете всички полета!", "Затвори", {
        duration: 8000,
        panelClass: ["custom-snackbar"],
      });
      return;
    } else {
      this.raiseError = false;
    }

    let date = this.date;
    let name = this.nameControl.value.trim();
    let phone = this.phoneControl.value.trim();
    let email = this.emailControl.value.trim();
    let note = this.noteControl.value.trim();

    let hour = parseInt(this.selectedHour.split(":")[0]);
    let minutes = parseInt(this.selectedHour.split(":")[1]);

    $("#dialog").hide(250);

    let resultOfEmptyHoursCheck = this.checkIfNextHourEmpty(
      hour,
      minutes,
      parseInt(this.selectedDuration.toString())
    );

    if (resultOfEmptyHoursCheck == 1) {
      this.error = 1;
      alert(
        "Няма достатъчно свободни часове, моля променете продължителността или часа на резервация"
      );
    } else if (resultOfEmptyHoursCheck == 2) {
      this.error = 2;
      alert(
        "Няма достатъчно свободни часове, моля променете продължителността или часа на резервация"
      );
    } else {
      this.error = -1;
      let id = this.generateGuidString();

      this.newEventJson(
        1,
        name,
        phone,
        date,
        this.date.getDate(),
        hour,
        minutes,
        note,
        email
      );
      // for (let i = 0; i < this.selectedDuration; i++) {
      //   if (minutes == 30) {
      //     hour++;
      //     minutes = 0;
      //   } else {
      //     minutes = 30;
      //   }
      // }

      this.nameControl.setValue("");
      this.phoneControl.setValue("");
      this.emailControl.setValue("");
      this.noteControl.setValue("");
      this.selectedPhone = null;
      this.selectedHour = null;
      this.selectedUserId = null;
    }

    date.setDate(this.date.getDate());
    this.getBookingsByMonthStatistics();
    this.dateClick(this.date.getDate());
  }

  public range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, index) => index + start);
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

  public checkIfBookingExist(hour) {
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

  public generateHourArray(): string[] {
    const hours: string[] = [];
    let hour: number = 8;
    let minute: number = 0;
    let endHour = 23;
    if (this.currentDay) {
      hour = new Date(this.currentDay.startPeriod).getHours();
      minute = new Date(this.currentDay.startPeriod).getMinutes();
      endHour = new Date(this.currentDay.endPeriod).getHours();
    }

    while (hour <= endHour) {
      const timeString: string = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      hours.push(timeString);

      minute += 30;
      if (minute === 60) {
        hour++;
        minute = 0;
      }
    }
    return hours;
  }

  // public showModal(id: string) {
  //   var index = this.bookingsOrigin.findIndex((x) => x.id == id);

  //   if (index != -1) {
  //     this.noteModal = this.bookingsOrigin[index];

  //     $("#modalNote").modal("show");
  //   }
  // }
  public showHolidayDayModal() {
    $("#modalCancel").modal("show");
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

  private getBookingsByBusiness(id: number) {
    let temp: Booking[] = [];
    if (!this.currentDay || this.currentDay?.isWorking) {
      this.generateHourArray().forEach((x) => {
        if (this.checkIfBookingExist(x) && (id == 1 || id == 3)) {
          temp.push(this.getBooking(x));
        } else if (
          !this.checkIfBookingExist(x) &&
          (id == 1 || id == 2) &&
          !this.isDayPast
        ) {
          let freeBook: Booking = {
            id: -1,
            bookingId: '',
            timestamp: new Date(),
            createdOn: new Date(),
            canceled: false,
            note: '',
            name: 'Свободен',
            email: '',
            phone: '',
            confirmed: false,
            registeredUser: false,
            duration: 0
          }
          temp.push(freeBook);
        }
      });
    }
    return temp;
  }

  getHourByString(value: string) {
    return parseInt(value.split(":")[0]);
  }

  getMinutesByString(value: string) {
    return parseInt(value.split(":")[1]);
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

  private checkIfNextHourEmpty(hour: number, minutes: number, count: number) {
    let index = 2; // ======== Current HACK ========

    // let index = this.bookings.findIndex(
    //   (x) => x.timestamp.getHours() == hour && minutes == x.timestamp.getMinutes()
    // );

    if (index + count > this.bookings.length) {
      return 2;
    }

    // Here will break because cant find INDEX!, the timestamp returns the CURRENT time!
    for (let i = 0; i < count; i++) {
      // if (this.bookings[index].id != -1) {
      if (this.bookings[index].id != -1) {
        return 1;
      }
      index++;
    }

    return 0;
  }

  private newEventJson(
    id: number,
    name: string,
    phone: string,
    date: Date,
    day: number,
    hour: number,
    minutes: number,
    note: string,
    email: string
  ) {
    let newEvent: Booking = {
      id: id,
      bookingId: '',
      timestamp: new Date(date.getFullYear(), date.getMonth(), day, hour, minutes),
      createdOn: new Date(),
      canceled: false,
      note: '',
      name: name,
      email: '',
      phone: phone,
      confirmed: false,
      registeredUser: false,
      duration: 0
    }

    var specificDate: Date = new Date(newEvent.timestamp.getFullYear(), newEvent.timestamp.getMonth(), day);
    specificDate.setHours(hour);
    specificDate.setMinutes(minutes);

    // need changes changed when API is ready!
    var dto: unknown = {
      dateTime: specificDate,
      userId: this.selectedUserId == undefined ? null : this.selectedUserId,
      facilityId: this.authService.getFacilityId(),
      note: note,
      duration: 30, // Upcoming Update
      name: this.selectedUserId != undefined ? null : name,
      phone: this.selectedUserId != undefined ? null : phone,
      email: this.selectedUserId != undefined ? null : email,
    };

    this.bookingService.addBooking(dto).subscribe((x) => {
      this.showBookings(1);
    });
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) => {
      if (option.name) {
        return option.name.toLowerCase().includes(filterValue);
      }
      return null;
    });
  }

  private _filterPhone(name: string): User[] {
    const filterValue = name.toLowerCase();
    var result = this.options.filter((option) => {
      if (option.phoneNumber) {
        return option.phoneNumber.toLowerCase().startsWith(filterValue);
      }
      return null;
    });
    return result;
  }

  private _filterEmail(name: string): User[] {
    const filterValue = name.toLowerCase();
    var result = this.options.filter((option) => {
      if (option.email) {
        return option.email.toLowerCase().startsWith(filterValue);
      }
      return null;
    });

    return result;
  }

  private generateGuidString(): string {
    const hexDigits = "0123456789abcdef";
    let guid = "";

    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * hexDigits.length);
      guid += hexDigits[randomIndex];
      if (i === 7 || i === 11 || i === 15 || i === 19) {
        guid += "-";
      }
    }

    return guid;
  }

  private daysInMonth(month: number, year: number): number {
    const monthStart: Date = new Date(year, month, 1);
    const monthEnd: Date = new Date(year, month + 1, 1);
    return (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24);
  }

  private InitDropdownFilters() {
    this.filteredOptions = this.nameControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const name = typeof value === "string" ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );

    this.filteredPhoneOptions = this.phoneControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const phone = typeof value === "string" ? value : value?.phone;
        return phone
          ? this._filterPhone(phone as string)
          : this.options.slice();
      })
    );

    this.filteredEmailOptions = this.emailControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const email = typeof value === "string" ? value : value?.email;
        return email
          ? this._filterEmail(email as string)
          : this.options.slice();
      })
    );
  }

  private markPastDates() {
    var currentDate = new Date();
    if (
      this.date.getFullYear() == currentDate.getFullYear() &&
      this.date.getMonth() == currentDate.getMonth()
    ) {
      for (let i = 1; i < currentDate.getDate(); i++) {
        if (i == this.date.getDate()) {
          this.isDayPast = true;
          continue;
        }
      }
      if (currentDate.getDate() <= this.date.getDate()) {
        this.isDayPast = false;
      }
    } else if (
      this.date.getFullYear() <= currentDate.getFullYear() &&
      this.date.getMonth() < currentDate.getMonth()
    ) {
      this.isDayPast = true;
      for (let i = 0; i < 35 + this.firstDay; i++) {
        const day = i - this.firstDay + 1;
        if (i == this.date.getDate()) continue;

        $(`#day-${i}`).addClass("past-date");
        const element = document.getElementById(`day-${i}`) as HTMLElement;
        if (element) element.classList.add("past-date");
      }
    } else {
      this.isDayPast = false;
    }
  }

  private showEventContainer() {
    $(".events-container").show(250);
    this.hideDialogs();
  }

  private hideDialogs() {
    $("#dialog").hide(250);
    $("#dialog2").hide(250);
  }

  truncateText(text: string, limit: number): string {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  }

  isPastDay(status: number): boolean {
    return status == DayStausEnum.Past;
  }

  isFreeDay(status: number): boolean {
    return status == DayStausEnum.Closed;
  }

  isFullDay(status: number) {
    return status == DayStausEnum.Full;
  }

  getBookingsByMonthStatistics() {
    this.bookingService
      .getBookingsByMonthStatistics(this.monthClicked, this.year)
      .subscribe((x) => {
        this.monthStatistics = x;

        this.initCalendar(this.date);
      });
  }

  loadInputUnderline() {
    return "border-primary";
  }
}
