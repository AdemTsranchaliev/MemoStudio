import { Component, HostListener, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FacilitySettingsViewModel } from "src/app/shared/models/facility/facility-setting-model";
import { DateTimeService } from "src/app/shared/services/date-time.service";
import { FacilityService } from "src/app/shared/services/facility.service";
import { AccountViewModel } from "../../shared/models/account/account.model";
import { ImgPreviewComponent } from "../../shared/dialogs/img-preview/img-preview.component";
import { Observable } from "rxjs";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";
import { Moment } from "moment";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: "app-finish-bussines-registration",
  templateUrl: "./finish-bussines-registration.component.html",
  styleUrls: ["./finish-bussines-registration.component.css"],
})
export class FinishBussinesRegistrationComponent implements OnInit {
  public bookingForm: FormGroup;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  public workingDaysFormArray: FormArray;
  public durations: number[] = [5, 15, 30, 60, 90, 120];
  public businessCategories = [
    'Салон за красота',
    'Фризьорски салон',
    'Козметичен салон',
  ];
  public startPeriodIndex: number;
  public endPeriodIndex: number;
  public timeSlots: Moment[] = [];
  public user: AccountViewModel;
  public newProfileImg: string;
  private currentSize: string;

  public truncationLength: number;
  public mobileLength: number = 14;
  public desktopLength: number = 55;

  constructor(
    private formBuilder: FormBuilder,
    private facilityService: FacilityService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    public dateTimeService: DateTimeService,
    public utilityService: UtilityService
  ) {
    // Set initial truncation length based on the window width
    this.truncationLength =
      window.innerWidth < 768 ? this.mobileLength : this.desktopLength;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event): void {
    // Adjust truncation length based on window width
    this.truncationLength =
      window.innerWidth < 768 ? this.mobileLength : this.desktopLength;
  }

  ngOnInit(): void {
    this.initForm();

    //this.workingDaysFormArray = this.formBuilder.array([]);

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
          this.dateTimeService.compareHoursAndMinutes(moment.utc(y), moment.utc(x.endPeriod)) ==
          0
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

  public initForm() {
    this.bookingForm = this.formBuilder.group({
      businessName: [null, Validators.required],
      facilityCategory: [this.businessCategories[0], Validators.required],
      startPeriod: [null, Validators.required],
      endPeriod: [null, Validators.required],
      interval: ["", Validators.required],
      workingDays: [[], Validators.required],
      allowUserBooking: [false, Validators.required],
      socialInstagram: [null],
      socialFacebook: [null],
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
      console.log(result);
      this.newProfileImg = result;
    });
  }
  public submitForm() {
    this.setStartAndEndPeriodForAllItems();
    if (true) {
      const formData = this.bookingForm;
      let resultToSend: FacilitySettingsViewModel = <FacilitySettingsViewModel>{
        name: formData.get("businessName").value,
        facilityCategory: formData.get("facilityCategory").value,
        startPeriod: formData.get("startPeriod").value,
        endPeriod: formData.get("endPeriod").value,
        interval: formData.get("interval").value,
        workingDaysJson: JSON.stringify(this.workingDaysFormArray.value),
        allowUserBooking: formData.get("allowUserBooking").value,
      };
      console.log(formData);
      // this.facilityService
      //   .updateFacilitySettings(resultToSend)
      //   .subscribe((x) => {
      //     this.snackBar.open("Данните бяха успешно запазени!", "Затвори", {
      //       duration: 8000,
      //       panelClass: ["custom-snackbar"],
      //     });
      //   });
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
