import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Moment } from "moment";

@Injectable({
  providedIn: "root",
})
export class DateTimeService {
  public generateTimeSlots(
    startPeriod: Moment,
    endPeriod: Moment,
    intervalMinute: number
  ) {
    //new instances of the dates
    var startPeriodTemp = moment.utc(startPeriod);
    var endPeriodTemp = moment.utc(endPeriod);

    if (intervalMinute <= 0 || intervalMinute > 90) {
      throw new Error("Invalid interval values");
    }

    if (startPeriodTemp > endPeriodTemp) {
      throw new Error("Start period cannot be greater than end period");
    }

    const timeSlots: Moment[] = [];
    let currentPeriod = startPeriodTemp;

    while (currentPeriod <= endPeriodTemp) {
      timeSlots.push(moment.utc(currentPeriod));
      currentPeriod = moment.utc(moment.utc(currentPeriod).add(30, 'minutes').toDate());
    }

    return timeSlots;
  }

  public compareHoursAndMinutes(date1: Moment, date2: Moment): number {
    const hour1 = date1.hours();
    const minute1 = date1.minutes();
    const hour2 = date2.hours();
    const minute2 = date2.minutes();

    if (hour1 == hour2 && minute1 == minute2) {
      return 0;
    } else {
      return 1;
    }
  }
}
