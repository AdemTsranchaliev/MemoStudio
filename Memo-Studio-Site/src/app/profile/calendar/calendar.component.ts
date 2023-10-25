import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BASE_URL_DEV } from "src/app/shared/routes";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  bookingForm: FormGroup;
  times: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23,
  ];
  durations: number[] = [5, 15, 30, 60, 90, 120];
  dayOfWeeks: string[] = [
    "Понеделник",
    "Вторник",
    "Сряда",
    "Четвъртък",
    "Петък",
    "Събота",
    "Неделя",
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<FacilitySettingsViewModel>(
        `${BASE_URL_DEV}/Facility/facility-settings`
      )
      .subscribe((x) => {
        this.bookingForm = this.fb.group({
          startPeriod: [
            this.getFormatedHour(x.StartPeriod),
            Validators.required,
          ],
          endPeriod: [this.getFormatedHour(x.EndPeriod), Validators.required],
          interval: [x.Interval, Validators.required],
          allowUserBooking: [x.AllowUserBooking],
        });
      });
  }

  submitForm() {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;
    }
  }

  getFormatedHour(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }
}

interface FacilitySettingsViewModel {
  StartPeriod: Date;
  EndPeriod: Date;
  Interval: number;
  WorkingDaysJson: string;
  AllowUserBooking: boolean;
}
