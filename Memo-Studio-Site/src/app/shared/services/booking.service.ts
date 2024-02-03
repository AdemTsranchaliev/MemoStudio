import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Booking, BookingsList } from "src/app/shared/models/booking.model";
import { BASE_URL_DEV } from "../routes";
import { MonthStatistics } from "../models/booking/month-statistics.model";
import { Moment } from "moment";
import * as moment from "moment";

const httpOptions = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
};

@Injectable({
  providedIn: "root",
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getReservationForDate(date: Moment, booking: Booking[]) {
    let result: Booking[] = [];

    booking.forEach((element) => {
      if (
        element.timestamp.day() == date.day() &&
        element.timestamp.month() == date.month() &&
        element.timestamp.year() == date.year()
      ) {
        result.push(element);
      }
    });

    return result;
  }

  removeReservation(id: number) {
    let data = localStorage.getItem("myData");
    if (data != null && data != "") {
      let modelArray: Booking[] = JSON.parse(data!);
      while (modelArray.findIndex((x) => x.id == id) != -1) {
        let index = modelArray.findIndex((x) => x.id == id);
        modelArray.splice(index, 1);
      }
      localStorage.setItem("myData", JSON.stringify(modelArray));
    }
  }

  public getBookingsByDate(date: Moment) {
    return this.http.get<BookingsList>(
      `${BASE_URL_DEV}/Booking/${date.toISOString()}`,
      httpOptions
    );
  }

  public getBookingListByDate(date: Moment) {
    return this.http.get<BookingsList>(
      `${BASE_URL_DEV}/Booking/${date.toISOString()}/list`,
      httpOptions
    );
  }

  public getBookingListByDateForUser(date: Moment, facilityId: string) {
    return this.http.get<BookingsList>(
      `${BASE_URL_DEV}/Booking/${date.toISOString()}/${facilityId}}/list-user`,
      httpOptions
    );
  }

  public addBooking(payload: any) {
    return this.http.post(`${BASE_URL_DEV}/Booking/create`, payload);
  }

  public deleteBooking(bookingId: string) {
    return this.http.delete(
      `${BASE_URL_DEV}/Booking/${bookingId}`,
      httpOptions
    );
  }

  public getBookingsByMonthStatistics(month: any, year: any) {
    return this.http.get<MonthStatistics[]>(
      `${BASE_URL_DEV}/Booking/month-statistics/${month}/${year}`,
      httpOptions
    );
  }

  public getBookingsByMonthStatisticsForUser(month: any, year: any, facilityId: string) {
    return this.http.get<MonthStatistics[]>(
      `${BASE_URL_DEV}/Booking/month-statistics/${month}/${year}/${facilityId}`,
      httpOptions
    );
  }
}
