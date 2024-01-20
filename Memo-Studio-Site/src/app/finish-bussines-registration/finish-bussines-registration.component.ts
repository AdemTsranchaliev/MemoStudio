import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormArray,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FacilitySettingsViewModel } from "src/app/shared/models/facility/facility-setting-model";
import { DateTimeService } from "src/app/shared/services/date-time.service";
import { FacilityService } from "src/app/shared/services/facility.service";
import { AccountViewModel } from "../shared/models/account/account.model";
import { ImgPreviewComponent } from "../shared/dialogs/img-preview/img-preview.component";
import { Observable } from "rxjs";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-finish-bussines-registration",
  templateUrl: "./finish-bussines-registration.component.html",
  styleUrls: ["./finish-bussines-registration.component.css"],
})
export class FinishBussinesRegistrationComponent implements OnInit {
  public bookingForm: FormGroup = new FormGroup({
    startPeriod: new FormControl(null), // Initialize with an empty string or the default value
    endPeriod: new FormControl(null),
    interval: new FormControl(""),
    workingDays: new FormArray([]),
    allowUserBooking: new FormControl(false), // Initialize with a default value
  });

  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  public workingDaysFormArray: FormArray;
  public durations: number[] = [5, 15, 30, 60, 90, 120];
  public startPeriodIndex: number;
  public endPeriodIndex: number;
  public timeSlots: Date[] = [];
  public user: AccountViewModel;
  private newProfileImg: string;
  private currentSize: string;

  constructor(
    private facilityService: FacilityService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    public dateTimeService: DateTimeService
  ) {}

  ngOnInit(): void {
    this.facilityService.getFacilitySettings().subscribe((x) => {
      this.bookingForm.patchValue(x);

      this.timeSlots = this.generateHours(x.startPeriod, x.endPeriod);
      this.startPeriodIndex = this.timeSlots.findIndex(
        (y) =>
          this.dateTimeService.compareHoursAndMinutes(
            y,
            new Date(x.startPeriod)
          ) == 0
      );
      this.endPeriodIndex = this.timeSlots.findIndex(
        (y) =>
          this.dateTimeService.compareHoursAndMinutes(
            y,
            new Date(x.endPeriod)
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
    });
  }
  public openDialog() {
    const dialogRef = this.dialog.open(ImgPreviewComponent, {
      width: "100vw",
      data: { size: this.currentSize },
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        dialogRef.updateSize("90%");
      } else {
        dialogRef.updateSize("50%");
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.newProfileImg = result?.changingThisBreaksApplicationSecurity;
    });
  }
  public submitForm() {
    this.setStartAndEndPeriodForAllItems();
    if (this.bookingForm.valid) {
      const formData = this.bookingForm;
      var resultToSend: FacilitySettingsViewModel = <FacilitySettingsViewModel>{
        startPeriod: formData.get("startPeriod").value,
        endPeriod: formData.get("endPeriod").value,
        interval: formData.get("interval").value,
        workingDaysJson: JSON.stringify(this.workingDaysFormArray.value),
        allowUserBooking: formData.get("allowUserBooking").value,
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

  public generateHours(from: Date, to: Date) {
    var start = new Date(from);
    var end = new Date(to);

    start.setHours(0);
    start.setMinutes(0);
    end.setHours(23);
    end.setMinutes(59);

    return this.dateTimeService.generateTimeSlots(start, end, 30);
  }

  public dateChange(isStartPeriod: boolean) {
    if (isStartPeriod) {
      this.bookingForm
        .get("startPeriod")
        .setValue(this.timeSlots[this.startPeriodIndex]);
    } else {
      this.bookingForm
        .get("endPeriod")
        .setValue(this.timeSlots[this.endPeriodIndex]);
    }
  }

  private createWorkingDayFormGroup(workingDay: any) {
    return new FormGroup({
      id: new FormControl(workingDay.id),
      day: new FormControl(workingDay.day),
      isOpen: new FormControl(workingDay.isOpen),
      openingTime: new FormControl(workingDay.openingTime),
      closingTime: new FormControl(workingDay.closingTime),
    });
  }

  private setStartAndEndPeriodForAllItems() {
    const startPeriodValue = this.bookingForm.get("startPeriod").value;
    const endPeriodValue = this.bookingForm.get("endPeriod").value;

    this.workingDaysFormArray.controls.forEach((control) => {
      const isOpen = control.get("isOpen").value;

      if (isOpen) {
        control.get("openingTime").setValue(startPeriodValue);
        control.get("closingTime").setValue(endPeriodValue);
      } else {
        control.get("openingTime").setValue(null);
        control.get("closingTime").setValue(null);
      }
    });
  }
}
