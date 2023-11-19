import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MonthStatistics } from "src/app/shared/models/booking/month-statistics.model";
import { DayStausEnum } from "src/app/shared/models/dayStatus.model";
import { BookingService } from "src/app/shared/services/booking.service";
declare const $: any;

@Component({
  selector: "app-calendar-overview",
  templateUrl: "./calendar-overview.component.html",
  styleUrls: ["./calendar-overview.component.css"],
})
export class CalendarOverviewComponent implements OnInit {
  @Output() dateChange: EventEmitter<Date> = new EventEmitter();

  public monthStatistics: MonthStatistics[] = [];
  public calendarRows = [];
  public date: Date = new Date();
  public dayCount: number;
  public isServerDown: boolean;
  public isDayPast: boolean;

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

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.initCalendar(this.date);
    this.getBookingsByMonthStatistics();
  }

  public showBookings(id: number) {}

  public dateClick(day: number) {
    this.date.setDate(day);
    this.dateChange.emit(this.date);
    // this.showEventContainer();
    // this.showBookings(1);
  }

  public monthClick(month: number) {
    // this.showEventContainer();
    this.date.setMonth(month);
    this.dateChange.emit(this.date);
    this.getBookingsByMonthStatistics();
  }

  public nextYear() {
    // this.hideDialogs();
    const newYear = this.date.getFullYear() + 1;
    this.date.setFullYear(newYear);
    this.dateChange.emit(this.date);
    this.getBookingsByMonthStatistics();
  }

  public prevYear() {
    // this.hideDialogs();
    const newYear = this.date.getFullYear() - 1;
    this.date.setFullYear(newYear);
    this.dateChange.emit(this.date);
    this.getBookingsByMonthStatistics();
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
    $("#dialog2").show(250);
  }

  private initCalendar(date: Date): void {
    this.calendarRows = [];
    let tempDate = date.getDate();
    const month = date.getMonth();
    this.dayCount = this.daysInMonth(month, date.getFullYear());

    date.setDate(1);
    this.date.setDate(tempDate);

    const firstDayOfMonth = new Date(date.getFullYear(), month);
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

    //this.dateClick(this.date.getDate());
    setTimeout(() => {
      this.markPastDates();
    }, 1);
    this.showBookings(1);
  }

  private getBookingsByMonthStatistics() {
    this.bookingService
      .getBookingsByMonthStatistics(
        this.date.getMonth() + 1,
        this.date.getFullYear()
      )
      .subscribe((x) => {
        this.monthStatistics = x;

        this.initCalendar(this.date);
      });
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
      for (let i = 0; i < 35 + this.date.getDay(); i++) {
        const day = i - this.date.getDay() + 1;
        if (i == this.date.getDate()) continue;

        $(`#day-${i}`).addClass("past-date");
        const element = document.getElementById(`day-${i}`) as HTMLElement;
        if (element) element.classList.add("past-date");
      }
    } else {
      this.isDayPast = false;
    }
  }
  private daysInMonth(month: number, year: number): number {
    const monthStart: Date = new Date(year, month, 1);
    const monthEnd: Date = new Date(year, month + 1, 1);
    return (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24);
  }
}