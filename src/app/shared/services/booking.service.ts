import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getReservationForDate(date: Date) {
    let result: Booking[] = [];

    let data = localStorage.getItem('myData');
    if (data != null && data != '') {
      let modelArray: Booking[] = JSON.parse(data!);

      modelArray.forEach((element) => {
        if (
          element.day == date.getDate() &&
          element.month == date.getMonth() &&
          element.year == date.getFullYear()
        ) {
          result.push(element);
        }
      });
    }
    return result;
  }

  removeReservation(id: string) {
    let data = localStorage.getItem('myData');
    if (data != null && data != '') {
      let modelArray: Booking[] = JSON.parse(data!);
      while (modelArray.findIndex((x) => x.id == id) != -1) {
        let index = modelArray.findIndex((x) => x.id == id);
        modelArray.splice(index, 1);
      }
      localStorage.setItem('myData', JSON.stringify(modelArray));
    }
  }
}
