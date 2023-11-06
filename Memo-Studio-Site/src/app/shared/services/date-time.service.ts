import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DateTimeService {
  public generateTimeSlots(
    startPeriod: Date,
    endPeriod: Date,
    intervalMinute: number
  ) {

    if (intervalMinute <= 0 || intervalMinute > 60) {
      throw new Error("Invalid interval values");
    }

    if (startPeriod > endPeriod) {
      throw new Error("Start period cannot be greater than end period");
    }

    const timeSlots: Date[] = [];
    let currentPeriod = new Date(startPeriod);

    while (currentPeriod <= endPeriod) {
      timeSlots.push(new Date(currentPeriod));
      currentPeriod.setMinutes(currentPeriod.getMinutes() + intervalMinute);
    }

    return timeSlots;
  }

  public compareHoursAndMinutes(date1: Date, date2: Date): number {

    const hour1 = date1.getHours();
    const minute1 = date1.getMinutes();
    const hour2 = date2.getHours();
    const minute2 = date2.getMinutes();

    if (hour1 < hour2) {
      return -1;
    } else if (hour1 > hour2) {
      return 1;
    } else {
      if (minute1 < minute2) {
        return -1;
      } else if (minute1 > minute2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}
