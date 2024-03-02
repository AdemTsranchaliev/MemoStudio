import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Day } from "src/app/shared/models/day.model";
import { BASE_URL_DEV } from "../routes";
import { DayConfigurations } from "../models/day-config.model";
import { Moment } from "moment";
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
    return this.http.post(`${BASE_URL_DEV}/day/add-day`, day);
  }

  public setHoliday(day: Moment) {
    return this.http.post(`${BASE_URL_DEV}/day/change-is-open`, { dateTime: day});
  }

  public getDayByDate(date: Moment) {
    return this.http.get<DayConfigurations>(`${BASE_URL_DEV}/Day/${date.toISOString()}`, httpOptions);
  }
}
