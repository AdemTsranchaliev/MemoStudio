import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEditDataSharingService } from './calendar-edit-data-sharing.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar-edit-day',
  templateUrl: './calendar-edit-day.component.html',
  styleUrls: ['./calendar-edit-day.component.css']
})
export class CalendarEditDayComponent implements OnInit {
  workingDayAddError: number = -1;
  timeSlots: Date[] = []; // get with sertvice
  durationArr: any[] = [
    { duration: "30", value: 30 },
    { duration: "1", value: 60 },
    { duration: "1:30", value: 90 },
    { duration: "2", value: 120 },
    { duration: "2:20", value: 150 },
    { duration: "3", value: 180 },
  ];

  public customDayConfigurationForm: FormGroup = this.formBuilder.group({
    periodStart: ["", Validators.required],
    periodEnd: ["", Validators.required],
    interval: [30, Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CalendarEditDayComponent>,
    public utilityService: UtilityService,
    private dataSharingService: CalendarEditDataSharingService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.dataSharingService.sharedData$.subscribe(currentData => {
      this.timeSlots = currentData;
    });

    this.customDayConfigurationForm.get('periodStart').setValue('08:00');
    this.customDayConfigurationForm.get('periodEnd').setValue('17:00');
  }

  public cancelEvent() {
    this.customDayConfigurationForm.reset();
  }

  public onSubmit() {
    // if (this.selectedStartHour > this.selectedEndHour) {
    //   this.workingDayAddError = 1;
    // } else {
    //   this.workingDayAddError = -1;
    //   var startTime = new Date(0, 0, 0);
    //   var endTime = new Date(0, 0, 0);

    //   if (this.selectedStartHour % 2 == 0) {
    //     startTime.setHours(this.selectedStartHour / 2);
    //   } else {
    //     startTime.setHours((this.selectedStartHour - 1) / 2);
    //     startTime.setMinutes(30);
    //   }

    //   if (this.selectedEndHour % 2 == 0) {
    //     endTime.setHours(this.selectedEndHour / 2);
    //   } else {
    //     endTime.setHours((this.selectedEndHour - 1) / 2);
    //     endTime.setMinutes(30);
    //   }

    //   this.currentDay = {
    //     dayDate: this.date,
    //     startPeriod: startTime,
    //     endPeriod: endTime,
    //     isWorking: true,
    //     employeeId: localStorage.getItem("clientId"),
    //   };

    //   this.dayService.addDay(this.currentDay).subscribe((x) => {
    // console.log('>>>>', x);
    //   });
  }
}
