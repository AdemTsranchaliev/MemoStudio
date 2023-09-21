import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { Booking } from "../shared/models/booking.model";
import { startWith, map, concatMap } from "rxjs/operators";
import { BookingService } from "../shared/services/booking.service";
import { User } from "../shared/models/user.model";
import { BookingDto } from "./booking-dto-model";
import { Day } from "../shared/models/day.model";
import { BASE_URL_PROD } from "../shared/routes";
import { UserService } from "../shared/services/user.service";
import { DayService } from "../shared/services/day.service";
import { ServerStatusService } from "../shared/services/serverStatus.service";
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
  noteControl = new FormControl("");
  options: User[] = [];
  selectedUserId: number;
  selectedFilter: number = 1;

  deleteBookingId: string;
  filteredOptions: Observable<User[]>;
  filteredPhoneOptions: Observable<User[]>;
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
  calendarRows: number[][];
  year: number;
  isServerDown: boolean;

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private dayService: DayService, // private bookingViewService: BookingViewService
    private serverStatusService: ServerStatusService,
  ) { }

  ngOnInit() {
    // Check server status
    this.serverStatusService.checkServerStatus().subscribe(
      () => {
        // Server is up, continue with initialization
        this.monthClick(this.date.getMonth());
        this.dateClick(this.date.getDate());
        this.InitDropdownFilters();
        this.isServerDown = false;
      },
      (error) => {
        this.isServerDown = true;
        console.error("Server is down:", error);
      }
    );

    let hardCodedID = '7FAD3AE0-1F9E-4607-A40B-71441F026620';
    this.userService.getAllUsers(hardCodedID).subscribe((x) => {
      this.options = x;
    });

    this.monthClick(this.date.getMonth());
    this.dateClick(this.date.getDate());

    this.InitDropdownFilters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public onOptionSelected(event: any): void {
    var selectedValue: User = event.option.value;
    this.phoneControl.setValue(selectedValue.phoneNumber);
    this.nameControl.setValue(selectedValue.name);
    this.selectedUserId = parseInt(selectedValue.id);
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

    let row: number[] = [];

    for (let i = 0; i < 35 + this.firstDay; i++) {
      const day = i - this.firstDay + 1;

      if (i % 7 === 0 && row.length > 0) {
        this.calendarRows.push(row);
        row = [];
      }
      let dayToAdd = -1;
      if (i < this.firstDay || day > this.dayCount) {
        dayToAdd = -1;
      } else {
        dayToAdd = day;
      }

      row.push(dayToAdd);
    }

    if (row.length > 0) {
      this.calendarRows.push(row);
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
    this.initCalendar(this.date);
  }

  public nextYear() {
    this.hideDialogs();
    const newYear = this.date.getFullYear() + 1;
    this.date.setFullYear(newYear);
    this.initCalendar(this.date);
  }

  public prevYear() {
    this.hideDialogs();
    const newYear = this.date.getFullYear() - 1;
    this.date.setFullYear(newYear);
    this.initCalendar(this.date);
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
      this.nameControl.value === null ||
      this.phoneControl.value === null ||
      this.selectedUserId === null ||
      this.selectedHour == null ||
      this.nameControl.value === "" ||
      this.phoneControl.value === ""
    ) {
      this.raiseError = true;
      return;
    } else {
      this.raiseError = false;
    }

    let date = this.date;
    let name = this.nameControl.value.trim();
    let phone = this.phoneControl.value.trim();
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

      for (let i = 0; i < this.selectedDuration; i++) {
        this.newEventJson(
          id,
          name,
          phone,
          date,
          this.date.getDate(),
          hour,
          minutes,
          i,
          note
        );
        if (minutes == 30) {
          hour++;
          minutes = 0;
        } else {
          minutes = 30;
        }
      }

      this.nameControl.setValue("");
      this.phoneControl.setValue("");
      this.noteControl.setValue("");
      this.selectedPhone = null;
      this.selectedHour = null;
      this.selectedUserId = null;
    }

    date.setDate(this.date.getDate());
    this.initCalendar(date);
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
        var ttt = hour == this.getHour(x.hour, x.minutes);
        return ttt;
      }) != -1
    );
  }

  public getHour(hour: number, minutes: number) {
    return `${hour.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
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

  public showModal(id: string) {
    var index = this.bookingsOrigin.findIndex((x) => x.id == id);

    if (index != -1) {
      this.noteModal = this.bookingsOrigin[index];

      $("#modalNote").modal("show");
    }
  }
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
        this.bookings = this.getBookingsByBusyness(id);
        this.loader = false;
      });
    });
  }

  private getBookingsByBusyness(id: number) {
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
            id: "-1",
            name: "СВОБОДЕН",
            phone: "",
            year: this.date.getFullYear(),
            month: this.date.getMonth(),
            day: this.date.getDate(),
            hour: this.getHourByString(x),
            minutes: this.getMinutesByString(x),
            free: true,
            freeHour: x,
            note: null,
          };
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
    let index = this.bookingsOrigin.findIndex(
      (x) => hour == this.getHour(x.hour, x.minutes)
    );
    return this.bookingsOrigin[index];
  }

  private checkIfNextHourEmpty(hour: number, minutes: number, count: number) {
    let index = this.bookings.findIndex(
      (x) => x.hour == hour && minutes == x.minutes
    );
    if (index + count > this.bookings.length) {
      return 2;
    }

    for (let i = 0; i < count; i++) {
      if (this.bookings[index].id != "-1") {
        return 1;
      }
      index++;
    }

    return 0;
  }

  private newEventJson(
    id: string,
    name: string,
    phone: string,
    date: Date,
    day: number,
    hour: number,
    minutes: number,
    index: number,
    note: string
  ) {
    let newEvent: Booking = {
      id: id,
      name: name,
      phone: phone,
      year: date.getFullYear(),
      month: date.getMonth(),
      note: note,
      day: day,
      hour: hour,
      minutes: minutes,
      free: false,
      freeHour: null,
    };
    var specificDate: Date = new Date(newEvent.year, newEvent.month, day);
    specificDate.setHours(hour);
    specificDate.setMinutes(minutes);

    var dto: BookingDto = {
      dateTime: specificDate,
      userId: this.selectedUserId,
      employeeId: parseInt(localStorage.getItem("clientId")),
      reservationId: id,
      index: index,
      note: note,
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

  isPastDay(day: number): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today.getDate();
  }

  isFreeDay(day: number): boolean {
    // When Backend ready need to be redo!
    const demoFreeDays = {
      saturday: 6,
      sunday: 7
    };
    return Object.values(demoFreeDays).includes(day);
  }

  isFullDay(day: number) {
    // console.log('>>> ', this.bookings.length);
    // console.log('>>> ', this.bookings[1].free);
    const demoFullDays = {
      saturday: 12,
    };
    return Object.values(demoFullDays).includes(day);
  }
}