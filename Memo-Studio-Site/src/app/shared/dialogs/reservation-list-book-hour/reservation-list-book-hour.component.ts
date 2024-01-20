import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { User } from '../../models/user.model';
import { map, startWith, take } from 'rxjs/operators';
import { FacilityService } from '../../services/facility.service';

@Component({
  selector: "app-reservation-list-book-hour",
  templateUrl: "./reservation-list-book-hour.component.html",
  styleUrls: ["./reservation-list-book-hour.component.css"],
})
export class ReservationListBookHourComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReservationListBookHourComponent>,
    public utilityService: UtilityService,
    private facilityService: FacilityService,
  ) { }

  ngOnInit(): void {
    this.InitDropdownFilters();

    this.facilityService.getService().subscribe((x) => {
      // ========= When API ready make new Field 'ServiceCategory' work =========
      console.log('>>>>', x);
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.data.bookingForm.reset();
      this.dialogRef.close(false);
    });
  }

  public onOptionSelected(event: any): void {
    const selectedValue: any = event.option.value;
    this.data.bookingForm.get("name").setValue(selectedValue.name);
    this.data.bookingForm.get("phone").setValue(selectedValue.phoneNumber);
    this.data.bookingForm.get("email").setValue(selectedValue.email);
  }

  compareFn(option1: any, option2: any): boolean {
    console.log(option1);
    console.log(option2);
    return true;
  }

  private InitDropdownFilters() {
    this.data.filteredOptions = this.data.bookingForm
      .get("name")
      .valueChanges.pipe(
        startWith(""),
        map((value) => {
          const name = typeof value === "string" ? value : (value as any)?.name;
          return name
            ? this._filter(name as string)
            : this.data.options.slice();
        })
      );

    this.data.filteredPhoneOptions = this.data.bookingForm
      .get("phone")
      .valueChanges.pipe(
        startWith(""),
        map((value) => {
          const phone =
            typeof value === "string" ? value : (value as any)?.phone;
          return phone
            ? this._filterPhone(phone as string)
            : this.data.options.slice();
        })
      );

    this.data.filteredEmailOptions = this.data.bookingForm
      .get("email")
      .valueChanges.pipe(
        startWith(""),
        map((value) => {
          const email =
            typeof value === "string" ? value : (value as any)?.email;
          return email
            ? this._filterEmail(email as string)
            : this.data.options.slice();
        })
      );
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.data.options.filter((option) => {
      if (option.name) {
        return option.name.toLowerCase().includes(filterValue);
      }
      return null;
    });
  }

  private _filterPhone(name: string): any {
    const filterValue = name.toLowerCase();
    var result = this.data.options.filter((option) => {
      if (option.phone) {
        return option.phone.toLowerCase().startsWith(filterValue);
      }
      return null;
    });
    return result;
  }

  private _filterEmail(name: string): User[] {
    const filterValue = name.toLowerCase();
    var result = this.data.options.filter((option) => {
      if (option.email) {
        return option.email.toLowerCase().startsWith(filterValue);
      }
      return null;
    });

    return result;
  }

  public cancelEvent() {
    this.data.bookingForm.reset();
  }

  public onSubmit() {
    const formattedTimestamp = this.data.bookingForm.get('timestamp').value;
    const timeArray = formattedTimestamp.split(':');

    const dateObj = new Date();
    dateObj.setHours(Number(timeArray[0]));
    dateObj.setMinutes(Number(timeArray[1]));
    this.data.bookingForm.get('timestamp').setValue(dateObj);

    this.dialogRef.close(this.data);
  }
}
