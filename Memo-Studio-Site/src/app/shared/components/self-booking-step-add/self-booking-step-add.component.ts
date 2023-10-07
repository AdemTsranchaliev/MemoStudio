import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-self-booking-step-add',
  templateUrl: './self-booking-step-add.component.html',
  styleUrls: ['./self-booking-step-add.component.css']
})
export class SelfBookingStepAddComponent implements OnInit {
  // ========= Set the dacorators properly when the API is ready =========
  @Input() date: any;
  @Input() hour: any;

  bookingForm: FormGroup;
  serviceList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

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
      phone: ['', [Validators.required, Validators.min(10), Validators.max(10), Validators.pattern("^[0-9]*$")]],
      services: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.bookingForm.invalid) {
      this.snackBar.open('Часът беше запазен успешно!', 'Затвори', {
        duration: 8000,
        panelClass: ["custom-snackbar"],
      });
    }
  }
}
