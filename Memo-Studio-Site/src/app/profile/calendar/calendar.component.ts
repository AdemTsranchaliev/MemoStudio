import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  bookingForm: FormGroup;
  times: number[] = [1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  durations: number[] = [5, 15, 30, 60, 90, 120];
  dayOfWeeks: string[] = ["Понеделник", "Вторник","Сряда","Четвъртък","Петък", "Събота","Неделя"];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      duration: ['', Validators.required],
      bookingFromUser: [false]
    });
  }

  submitForm() {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;
      console.log(formData); // You can send this data to your backend or process it as needed.
    }
  }

}
