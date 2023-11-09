import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-self-booking-step-add-demo',
  templateUrl: './self-booking-step-add-demo.component.html',
  styleUrls: ['./self-booking-step-add-demo.component.css']
})
export class SelfBookingStepAddDemoComponent implements OnInit {
  // ========= Set the dacorators properly when the API is ready =========
  @Input() date: any;
  @Input() hour: any;
  bookingForm: FormGroup;

  // Will came from API
  serviceList: string[] = ['HTML & CSS', 'Bootstrap', 'JavaScript', 'Node.Js', 'React JS', 'Mango DB'];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.bookingForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.min(3), Validators.max(20)]],
      lastName: ['', [Validators.required, Validators.min(3), Validators.max(20)]],
      phone: ['', [Validators.required, this.validatePhoneNumber.bind(this)]],
      services: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.bookingForm.invalid) {
      console.log('>>>', this.bookingForm.value);

      this.snackBar.open('Часът беше запазен успешно!', 'Затвори', {
        duration: 8000,
        panelClass: ["custom-snackbar"],
      });
    }
  }

  validatePhoneNumber(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && (value.length < 10 || value.length > 10 || !/^[0-9]*$/.test(value))) {
      return { 'invalidPhoneNumber': true };
    }

    return null;
  }

  handleCheckboxSelectEvent(newEvent: string[]) {
    this.bookingForm.get('services').setValue(newEvent);
  }
}
