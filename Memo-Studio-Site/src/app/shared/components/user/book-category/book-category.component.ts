import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ServiceCategoryResponse } from 'src/app/shared/models/facility/facility-service.model';
import { BookDataSharingService } from './book-data-sharing.service';

@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})
export class BookCategoryComponent {
  @Input() serviceCategories: ServiceCategoryResponse[] = [];

  constructor(
    private stepper: MatStepper,
    private bookDataSharingService: BookDataSharingService,
  ) { }

  categorySelect(categoryId: any) {
    this.bookDataSharingService.updateData(categoryId);
    this.stepper.next();
  }
}
