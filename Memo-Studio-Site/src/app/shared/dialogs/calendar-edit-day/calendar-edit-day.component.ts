import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { UtilityService } from "../../services/utility.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DayService } from "../../services/day.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, Subscription } from "rxjs";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { CancelMessageDialogComponent } from "../cancel-message/cancel-message.component";
import { DateTimeService } from "../../services/date-time.service";
import * as moment from "moment";
import { Moment } from "moment";

@Component({
  selector: "app-calendar-edit-day",
  templateUrl: "./calendar-edit-day.component.html",
  styleUrls: ["./calendar-edit-day.component.css"],
})
export class CalendarEditDayComponent implements OnInit {
  public workingDayAddError: number = -1;
  public isOpen: boolean = false;

  public timeSlots: Moment[] = [];
  public durationArr: any[] = [
    { duration: "30 минути", value: 30 },
    { duration: "60 минути", value: 60 },
    { duration: "90 минути", value: 90 },
    { duration: "120 минути", value: 120 },
    { duration: "150 минути", value: 150 },
    { duration: "180 минути", value: 180 },
  ];

  public customDayConfigurationForm: FormGroup = this.formBuilder.group({
    periodStart: ["", Validators.required],
    periodEnd: ["", Validators.required],
    interval: [0, Validators.required],
  });

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CalendarEditDayComponent>,
    public utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private dayService: DayService,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public dateTimeService: DateTimeService
  ) {}

  ngOnInit(): void {
    this.timeSlots = this.generateHours(moment.utc(), moment.utc());
    
    this.dayService.getDayByDate(this.data.date).subscribe((x) => {
      
      x.closingTime = moment.utc(x.closingTime);
      x.openingTime = moment.utc(x.openingTime);
      let startIndex = this.timeSlots.findIndex(
        (times) =>
          times.hours() == x.openingTime.hours() &&
          times.minutes() == x.openingTime.minutes()
      );
      let endIndex = this.timeSlots.findIndex(
        (times) =>
          times.hours() == x.closingTime.hours() &&
          times.minutes() == x.closingTime.minutes()
      );
      
      this.customDayConfigurationForm.get("periodStart").setValue(startIndex);
      this.customDayConfigurationForm.get("periodEnd").setValue(endIndex);
      this.customDayConfigurationForm.get("interval").setValue(x.interval);
      this.isOpen = x.isOpen;
    });
  }

  public cancelEvent() {
    this.customDayConfigurationForm.reset();
  }

  public manageIsFreeDay() {
    this.isOpen ? this.makeDayFree() : this.makeDayBusiness();
  }

  public makeDayFree() {
    const dialogRef = this.dialog.open(CancelMessageDialogComponent, {
      width: "100vw",
      data: {
        dialogTitle: "Внимание",
        dialogTitleStyle: "text-danger",
        dialogMessageContent: [
          "Сигурни ли сте, че искате да направите този ден почивен?",
          "Ако направите този ден почивен всички запазени часове ще бъдат отменени и няма да могат да бъдет върнати!",
          "Всички ваши клиенти ще получат съобщение, че резервациите им са отменени!",
        ],
        dialogCancelBtnContent: "Потвърди",
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
        this.dayService.setHoliday(this.data.date).subscribe((x) => {
          this.dialogRef.close(true);

          this.isOpen = !this.isOpen;
          const msg = "Направихте този ден почивен!";

          this.snackBar.open(msg, "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        });
      }
    });
  }

  public makeDayBusiness() {
    const msg = "Направихте този ден работен!";
    this.isOpen = !this.isOpen;

    this.snackBar.open(msg, "Затвори", {
      duration: 8000,
      panelClass: ["custom-snackbar"],
    });
  }

  public onSubmit() {
    let selectedStartHour =
      this.customDayConfigurationForm.get("periodStart").value;
    let selectedEndHour =
      this.customDayConfigurationForm.get("periodEnd").value;
    let interval = this.customDayConfigurationForm.get("interval").value;

    if (selectedStartHour > selectedEndHour) {
      this.workingDayAddError = 1;
    } else {
      this.workingDayAddError = -1;

      const currentDay = {
        dayDate: this.data.date,
        startPeriod: this.timeSlots[selectedStartHour],
        endPeriod: this.timeSlots[selectedEndHour],
        isOpen: this.isOpen,
        interval: interval,
      };

      this.dayService.addDay(currentDay).subscribe((x) => {
        this.dialogRef.close(true);
      });
    }
  }

  private generateHours(from: Moment, to: Moment) {
    const start: Moment = moment.utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const end: Moment = moment.utc().set({ hour: 21, minute: 30, second: 0, millisecond: 0 });

    return this.dateTimeService.generateTimeSlots(start, end, 30);
  }
}
