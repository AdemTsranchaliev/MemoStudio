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
  constructor(private http: HttpClient) {}

  public addDay(day: Day) {
    return this.http.post(`${BASE_URL_DEV}/day/AddDay`, day);
  }

  public setHoliday(day: Day) {
    return this.http.post(`${BASE_URL_DEV}/day/holiday`, day);
  }

  public getDayByDate(date: Date) {
    return this.http.get<Day>(
      `${BASE_URL_DEV}/Day/${date.toDateString()}/1`,
      httpOptions
    );
  }
}
