import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MonthStatistics } from "src/app/shared/models/booking/month-statistics.model";
import { DayStausEnum } from "src/app/shared/models/dayStatus.model";
import { BookingService } from "src/app/shared/services/booking.service";
import { DateCalendar } from "../date.model";
import { Moment } from "moment";
import * as moment from "moment";
import { da } from "date-fns/locale";
import { MatSnackBar } from "@angular/material/snack-bar";
declare const $: any;

@Component({
  selector: "app-calendar-overview",
  templateUrl: "./calendar-overview.component.html",
  styleUrls: ["./calendar-overview.component.css"],
})
export class CalendarOverviewComponent implements OnInit {
  @Output() dateChange: EventEmitter<DateCalendar> = new EventEmitter();
  @Output() editDayButtonClick: EventEmitter<any> = new EventEmitter();
  @Input() isDayPast: boolean;

  public monthStatistics: MonthStatistics[] = [];
  public calendarRows = [];
  public date: Moment = moment.utc();
  public dayCount: number;
  public isServerDown: boolean;
  public test: any[] = [];

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

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.initCalendar(this.date);
    this.getBookingsByMonthStatistics();
  }

  public showBookings(id: number) { }

  public dateClick(day: number) {
    this.date.date(day);

    this.checkIfDayIsPast();
    this.dateChange.emit(<DateCalendar>{
      date: this.date,
      isPastDate: this.isDayPast,
    });
  }

  public monthClick(month: number) {
    this.date.month(month);
    this.getBookingsByMonthStatistics();
    this.checkIfDayIsPast();
    this.dateChange.emit(<DateCalendar>{
      date: this.date,
      isPastDate: this.isDayPast,
    });
  }

  public nextYear() {
    const newYear = this.date.year() + 1;
    this.date.year(newYear);
    this.getBookingsByMonthStatistics();
    this.checkIfDayIsPast();
    this.dateChange.emit(<DateCalendar>{
      date: this.date,
      isPastDate: this.isDayPast,
    });
  }

  public prevYear() {
    const newYear = this.date.year() - 1;
    this.date.year(newYear);
    this.getBookingsByMonthStatistics();
    this.checkIfDayIsPast();
    this.dateChange.emit(<DateCalendar>{
      date: this.date,
      isPastDate: this.isDayPast,
    });
  }

  public isPastDay(status: number): boolean {
    return status == DayStausEnum.Past;
  }

  public isFreeDay(status: number): boolean {
    return status == DayStausEnum.Closed;
  }

  public isFullDay(status: number) {
    return status == DayStausEnum.Full;
  }

  public editDay() {
    this.editDayButtonClick.emit();
    $("#dialog2").show(250);
  }

  public getBookingsByMonthStatistics() {
    this.bookingService
      .getBookingsByMonthStatistics(
        this.date.month() + 1,
        this.date.year()
      )
      .subscribe({
        next: (x) => {
          this.monthStatistics = x;
          this.test = [...x];
          this.initCalendar(this.date);
        },
        error: (err) => {
          this.snackBar.open(err, "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        },
      });
  }

  private initCalendar(date: Moment): void {
    this.calendarRows = [];
    let tempDate = date.date();
    const month = date.month();
    this.dayCount = this.daysInMonth(month, date.year());

    date.date(1);

    this.date.date(tempDate);

    const firstDayOfMonth = date.startOf("month");
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const startingDay = dayNames[firstDayOfMonth.day()];

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

    this.dateClick(moment().date());
    setTimeout(() => {
      this.markPastDates();
    }, 1);
    this.showBookings(1);
  }

  private markPastDates() {
    let currentDate = moment.utc();
    if (
      this.date.year() == currentDate.year() &&
      this.date.month() == currentDate.month()
    ) {
      for (let i = 1; i < currentDate.date(); i++) {
        if (i == this.date.date()) {
          continue;
        }
      }
    } else if (
      this.date.year() <= currentDate.year() &&
      this.date.month() < currentDate.month()
    ) {
      for (let i = 0; i < 35 + this.date.day(); i++) {
        const day = i - this.date.day() + 1;
        if (i == this.date.date()) continue;

        $(`#day-${i}`).addClass("past-date");
        const element = document.getElementById(`day-${i}`) as HTMLElement;
        if (element) element.classList.add("past-date");
      }
    } else {
    }
  }
  private daysInMonth(month: number, year: number): number {
    const monthStart: Date = new Date(year, month, 1);
    const monthEnd: Date = new Date(year, month + 1, 1);
    return (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24);
  }

  private checkIfDayIsPast() {
    this.isDayPast =
      this.test.find((x) => x.day == this.date.date())?.status == 3;
  }
}
