import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookingDto } from "src/app/models/booking-dto-model";
import { Booking } from "src/app/models/booking.model";
import { BASE_URL_DEV } from "../routes";
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
        element.day == date.getDate() &&
        element.month == date.getMonth() &&
        element.year == date.getFullYear()
      ) {
        result.push(element);
      }
    });

    return result;
  }

  removeReservation(id: string) {
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
    return this.http.get<Booking[]>(
      `${BASE_URL_DEV}/Booking/${date.toDateString()}/${localStorage.getItem(
        "clientId"
      )}/get`,
      httpOptions
    );
  }

  public getBookingByUserId(userId: number) {
    return this.http.get<Booking[]>(
      `${BASE_URL_DEV}/Booking/${userId}`,
      httpOptions
    );
  }

  public addBooking(dto: BookingDto) {
    return this.http.post(`${BASE_URL_DEV}/Booking/add`, dto);
  }

  public deleteBooking(bookingId: string) {
    return this.http.delete(
      `${BASE_URL_DEV}/Booking/${bookingId}`,
      httpOptions
    );
  }
}
