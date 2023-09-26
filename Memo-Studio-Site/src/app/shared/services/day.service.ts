import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Day } from "src/app/shared/models/day.model";
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
export class DayService {
  constructor(private http: HttpClient) { }

  public addDay(day: Day) {
    return this.http.post(`${BASE_URL_DEV}/day/AddDay`, day);
  }

  public setHoliday(day: Day) {
    return this.http.post(`${BASE_URL_DEV}/day/holiday`, day);
  }

  public getDayByDate(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(7, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    return this.http.get<Day>(
      `${BASE_URL_DEV}/Day/${formattedDate}`,
      httpOptions
    );
  }
}
