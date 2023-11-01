import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Booking } from "src/app/shared/models/booking.model";
import { BASE_URL_DEV } from "../routes";
import { MonthStatistics } from "../models/booking/month-statistics.model";

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

  getReservationForDate(date: Date, booking: Booking[]) {
    let result: Booking[] = [];

    booking.forEach((element) => {
      if (
        element.timestamp.getDay() == date.getDate() &&
        element.timestamp.getMonth() == date.getMonth() &&
        element.timestamp.getFullYear() == date.getFullYear()
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

  public getBookingsByDate(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(7, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    return this.http.get<Booking[]>(
      `${BASE_URL_DEV}/Booking/${formattedDate}`,
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
}
