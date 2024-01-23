import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEditDataSharingService } from './calendar-edit-data-sharing.service';
import { DayService } from '../../services/day.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { CancelMessageDialogComponent } from '../cancel-message/cancel-message.component';

@Component({
  selector: 'app-calendar-edit-day',
  templateUrl: './calendar-edit-day.component.html',
  styleUrls: ['./calendar-edit-day.component.css']
})
export class CalendarEditDayComponent implements OnInit {
  workingDayAddError: number = -1;
  isDayFree: boolean = false;

  timeSlots: Date[] = [];
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

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CalendarEditDayComponent>,
    public utilityService: UtilityService,
    private dataSharingService: CalendarEditDataSharingService,
    private formBuilder: FormBuilder,
    private dayService: DayService,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
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

  public manageIsFreeDay() {
    !this.isDayFree ? this.makeDayFree() : this.makeDayBusiness();
  }

  public makeDayFree() {
    const dialogRef = this.dialog.open(CancelMessageDialogComponent, {
      width: "100vw",
      data: {
        dialogTitle: 'Внимание',
        dialogTitleStyle: 'text-danger',
        dialogMessageContent: ['Сигурни ли сте, че искате да направите този ден почивен?', 'Ако направите този ден почивен всички запазени часове ще бъдат отменени и няма да могат да бъдет върнати!', 'Всички ваши клиенти ще получат съобщение, че резервациите им са отменени!'],
        dialogCancelBtnContent: 'Потвърди',
      },
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        dialogRef.updateSize("90%");
      } else {
        dialogRef.updateSize("50%");
      }
    });
    this.subscriptions.push(smallDialogSubscription);

    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.isDayFree = !this.isDayFree;
        const msg = 'Направихте този ден почивен!';

        this.snackBar.open(msg, "Затвори", {
          duration: 8000,
          panelClass: ["custom-snackbar"],
        });
      }
    });
  }

  public makeDayBusiness() {
    const msg = 'Направихте този ден работен!';
    this.isDayFree = !this.isDayFree;

    this.snackBar.open(msg, "Затвори", {
      duration: 8000,
      panelClass: ["custom-snackbar"],
    });
  }

  public onSubmit() {
    let selectedStartHour = this.customDayConfigurationForm.get('periodStart').value;
    let selectedEndHour = this.customDayConfigurationForm.get('periodEnd').value;

    let startTime = new Date('1970-01-01T' + selectedStartHour + 'Z');
    let endTime = new Date('1970-01-01T' + selectedEndHour + 'Z');

    if (startTime > endTime) {
      this.workingDayAddError = 1;
    } else {
      this.workingDayAddError = -1;

      const currentDay = {
        dayDate: this.data.date,
        startPeriod: startTime,
        endPeriod: endTime,
        isWorking: true,
        employeeId: localStorage.getItem("clientId"), // This field is NULL
      };

      this.dayService.addDay(currentDay).subscribe((x) => {
        console.log('>>>>', x);
      });
    }
  }
}

