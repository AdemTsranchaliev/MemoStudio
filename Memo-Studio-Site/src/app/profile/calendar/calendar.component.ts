import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment";
import { Moment } from "moment";
import { Booking } from "src/app/shared/models/booking.model";
import { FacilitySettingsViewModel } from "src/app/shared/models/facility/facility-setting-model";
import { DateTimeService } from "src/app/shared/services/date-time.service";
import { FacilityService } from "src/app/shared/services/facility.service";

@Component({
  selector: "app-calendar-profile",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  bookings: any[] = [];
  additionalSettings: boolean = false;
  selectedIndices: number[] = [];

  public bookingForm: FormGroup = new FormGroup({
    startPeriod: new FormControl(null), // Initialize with an empty string or the default value
    endPeriod: new FormControl(null),
    interval: new FormControl(""),
    workingDays: new FormArray([]),
    allowUserBooking: new FormControl(false), // Initialize with a default value
  });

  public workingDaysFormArray: FormArray;
  public durations: number[] = [5, 15, 30, 60, 90, 120];
  public startPeriodIndex: number;
  public endPeriodIndex: number;
  public timeSlots: Moment[] = [];

  constructor(
    private facilityService: FacilityService,
    private snackBar: MatSnackBar,
    public dateTimeService: DateTimeService
  ) { }

  ngOnInit(): void {
    this.facilityService.getFacilitySettings().subscribe((x) => {
      this.bookingForm.patchValue(x);

      this.timeSlots = this.generateHours(x.startPeriod, x.endPeriod);
      this.startPeriodIndex = this.timeSlots.findIndex(
        (y) =>
          this.dateTimeService.compareHoursAndMinutes(
            moment.utc(y),
            moment.utc(x.startPeriod)
          ) == 0
      );
      this.endPeriodIndex = this.timeSlots.findIndex(
        (y) =>
          this.dateTimeService.compareHoursAndMinutes(
            moment.utc(y),
            moment.utc(x.endPeriod)
          ) == 0
      );

      const workingDaysArray = JSON.parse(x.workingDaysJson);
      this.workingDaysFormArray = this.bookingForm.get(
        "workingDays"
      ) as FormArray;
      workingDaysArray.forEach((workingDay) => {
        this.workingDaysFormArray.push(
          this.createWorkingDayFormGroup(workingDay)
        );
      });

      this.generateHoursArray();
    });
  }

  public submitForm() {
    this.setStartAndEndPeriodForAllItems();
    if (this.bookingForm.valid) {
      let resultToSend: FacilitySettingsViewModel = <FacilitySettingsViewModel>{
        startPeriod: this.bookingForm.get("startPeriod").value,
        endPeriod: this.bookingForm.get("endPeriod").value,
        interval: this.bookingForm.get("interval").value,
        workingDaysJson: JSON.stringify(this.workingDaysFormArray.value),
        allowUserBooking: this.bookingForm.get("allowUserBooking").value,
      };

      this.facilityService
        .updateFacilitySettings(resultToSend)
        .subscribe((x) => {
          this.snackBar.open("Данните бяха успешно запазени!", "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        });
    }
  }

  public generateHours(from: Moment, to: Moment) {
    let start = moment.utc(from);
    let end = moment.utc(to);

    start.hours(0);
    start.minutes(0);
    end.hours(23);
    end.minutes(59);

    return this.dateTimeService.generateTimeSlots(start, end, 30);
  }

  public dateChange(isStartPeriod: string) {
    if (isStartPeriod == 'start') {
      this.bookingForm
        .get("startPeriod")
        .setValue(this.timeSlots[this.startPeriodIndex]);
    } else if (isStartPeriod == 'end') {
      this.bookingForm
        .get("endPeriod")
        .setValue(this.timeSlots[this.endPeriodIndex]);
    }

    this.generateHoursArray();
  }

  private createWorkingDayFormGroup(workingDay: any) {
    return new FormGroup({
      id: new FormControl(workingDay.id),
      day: new FormControl(workingDay.day),
      isOpen: new FormControl(workingDay.isOpen),
      openingTime: new FormControl(this.bookingForm.get("startPeriod").value),
      closingTime: new FormControl(this.bookingForm.get("endPeriod").value),
      interval: new FormControl(this.bookingForm.get("interval").value),
    });
  }

  private setStartAndEndPeriodForAllItems() {
    const startPeriodValue = this.bookingForm.get("startPeriod").value;
    const endPeriodValue = this.bookingForm.get("endPeriod").value;
    const interval = this.bookingForm.get("interval").value;

    this.workingDaysFormArray.controls.forEach((control) => {
      control.get("openingTime").setValue(startPeriodValue);
      control.get("closingTime").setValue(endPeriodValue);
      control.get("interval").setValue(interval);
    });
  }

  public toggleAdditionalSettings() {
    this.additionalSettings = !this.additionalSettings;
  }

  // Method to generate the array of hours based on the interval
  public generateHoursArray() {
    const startHour = moment.utc(this.bookingForm.get('startPeriod').value);
    const endHour = moment.utc(this.bookingForm.get('endPeriod').value);
    const interval = this.bookingForm.get('interval').value;

    // Initialize the result array
    const hoursArray: string[] = [];

    // Set the start hour's minutes and seconds to 0
    startHour.minutes(0);
    startHour.seconds(0);

    // Loop from start hour to end hour, incrementing by the interval
    let currentHour = startHour.clone();
    while (currentHour.isSameOrBefore(endHour)) {
      // Add the current hour to the result array
      hoursArray.push(currentHour.format('HH:mm'));

      // Increment the current hour by the interval
      currentHour.add(interval, 'minutes');
    }

    // Set the generated array to the timeSlots variable
    this.bookings = hoursArray.map(hour => moment.utc(hour, 'HH:mm'));
  }

  toggleSelection(index: number) {
    const selectedIndex = this.selectedIndices.indexOf(index);
    if (selectedIndex === -1) {
      this.selectedIndices.push(index);
    } else {
      this.selectedIndices.splice(selectedIndex, 1);
    }
  }
  
  isSelected(index: number): boolean {
    return this.selectedIndices.includes(index);
  }
}
