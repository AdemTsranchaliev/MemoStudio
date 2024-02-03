import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ServiceCategoryResponse } from 'src/app/shared/models/facility/facility-service.model';

@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})
export class BookCategoryComponent {

  @Input() serviceCategories: ServiceCategoryResponse[] = [];

  constructor(
    private stepper: MatStepper,
  ) { }

  categorySelect(categoryId: number) {
    this.stepper.next();
  }
}
