import { Injectable, LOCALE_ID, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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


// ========== Will be changed when API is ready ==========
import { DatePipe } from '@angular/common';
export class DateModel {
    public date: Date;
    public DayOfWeek: string;
    public month: string;
    public isDisabled: boolean;
    public isClicked: boolean;
}

@Injectable({
    providedIn: "root",
})
export class SelfBookingService {
    // ========== Will be REMOVED when API is ready ==========
    days: DateModel[] = [];
    daysOfWeek = ["ПОН", "ВТО", "СРЯ", "ЧЕТ", "ПЕТ", "СЪБ", "НЕД"];
    timeIntervals: string[] = [];

    constructor(
        private http: HttpClient, // Remove
        private datePipe: DatePipe, // Remove
        @Inject(LOCALE_ID) private locale: string,
    ) { }

    // ========== Will be changed when API is ready ==========
    public getDays() {
        const today = new Date();

        // Define the number of months to generate dates for
        const numMonthsToShow = 3; // You can adjust this as needed

        for (let monthOffset = 0; monthOffset < numMonthsToShow; monthOffset++) {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 0);

            for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
                const monthName = this.datePipe.transform(day, 'LLLL', this.locale);
                this.days.push({
                    date: new Date(day),
                    DayOfWeek: this.daysOfWeek[day.getDay()],
                    month: monthName,
                    isDisabled: false,
                    isClicked: false,
                });
            }
        }

        return this.days;

        // return this.http.get(`${BASE_URL_DEV}/Days`, httpOptions);
    }

    public getFreeHours() {
        // ============== Will be removed when API is ready! ==============
        const startTime = 8 * 60; // 8:00 in minutes
        const endTime = 17 * 60; // 17:00 in minutes
        const interval = 30; // 30-minute interval

        for (let minutes = startTime; minutes <= endTime; minutes += interval) {
            const hour = Math.floor(minutes / 60);
            const minute = minutes % 60;
            const time = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
            this.timeIntervals.push(time);
        }

        return this.timeIntervals;

        // return this.http.get(`${BASE_URL_DEV}/FreeHours`, httpOptions);
    }
}
