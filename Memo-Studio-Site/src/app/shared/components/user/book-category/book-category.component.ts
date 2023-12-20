import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})
export class BookCategoryComponent implements OnInit {

  constructor(
    private stepper: MatStepper,
  ) { }

  ngOnInit(): void {
  }

  nextStep() {
    this.stepper.next();
  }
}
