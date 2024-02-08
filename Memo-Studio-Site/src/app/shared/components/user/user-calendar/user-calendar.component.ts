import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BookingService } from "../../../../shared/services/booking.service";
import { DateTimeService } from "../../../../shared/services/date-time.service";
import { DayService } from "../../../../shared/services/day.service";
import { Booking } from "../../../../shared/models/booking.model";
import { Day } from "../../../../shared/models/day.model";
import { FacilityService } from "../../../../shared/services/facility.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Moment } from "moment";
import * as moment from "moment";
import { mergeMap } from "rxjs/operators";
import { ServiceCategoryResponse, ServiceForUserResponse } from "src/app/shared/models/facility/facility-service.model";
import { FacilityInformationViewModel } from "src/app/shared/models/facility/facility-information.model";
declare const $: any;

@Component({
  selector: "app-user-calendar",
  templateUrl: "./user-calendar.component.html",
  styleUrls: ["./user-calendar.component.css"],
})
export class UserCalendarComponent implements OnInit {
  public isDayPast: boolean = false;
  public isServerDown: boolean = false;
  public loader: boolean = false;
  public date: Moment = moment.utc();
  public facilityConfiguration: any;

  public bookings: Booking[] = [];
  public bookingsOrigin: Booking[] = [];

  public serviceCategories: ServiceCategoryResponse[];
  public facilityInformation: FacilityInformationViewModel;
  public facilityId: string;

  constructor(
    private bookingService: BookingService,
    private dayService: DayService,
    private facilityService: FacilityService,
    private fb: FormBuilder,
    public dateTimeService: DateTimeService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        mergeMap((params) => {
          const id = params.get("id");
          this.facilityId = id;
          return this.facilityService.getFacilityServicesUser(id);
        })
      )
      .subscribe(
        (result) => {
          this.facilityInformation = <FacilityInformationViewModel>{ name: result.name, imageBase64: result.imageBase64 };
          this.serviceCategories = result.services;
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }

  public dateChange(date) {
    this.date = date;
    this.bookingService.getBookingListByDateForUser(this.date, this.facilityId).subscribe((x) => {
      this.bookingsOrigin = x.bookings;
    });
  }

  public editDay() {
    $("#customDayConfigurationDialog").show(250);
  }
}
