import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-self-booking-modal',
  templateUrl: './self-booking-modal.component.html',
  styleUrls: ['./self-booking-modal.component.css']
})
export class SelfBookingModalComponent implements OnInit {
  bookingForm: FormGroup;
  serviceList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
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

    }
  }
}
