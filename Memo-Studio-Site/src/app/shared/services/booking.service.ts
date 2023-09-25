import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookingDto } from "src/app/booking/booking-dto-model";
import { Booking } from "src/app/shared/models/booking.model";
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
  constructor(private http: HttpClient) { }

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
      `${BASE_URL_DEV}/Booking/${date.toDateString()}/20/get`,
      httpOptions
    );
  }

  public addBooking(dto: BookingDto) {
    console.log(dto);
    dto.employeeId = 20;
    return this.http.post(`${BASE_URL_DEV}/Booking/add`, dto);
  }

  public deleteBooking(bookingId: string) {
    return this.http.delete(
      `${BASE_URL_DEV}/Booking/${bookingId}`,
      httpOptions
    );
  }

  public getBookingsByMonthStatistics(facilityId: any, month: any, year: any) {
    return this.http.get<Booking[]>(
      `https://localhost:7190/${facilityId}/month-statistics/${month}/${year}`,
      httpOptions
    );
  }
}
