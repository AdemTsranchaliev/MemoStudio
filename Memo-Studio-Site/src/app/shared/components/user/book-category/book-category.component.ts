import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ServiceCategoryResponse, ServiceResponse } from 'src/app/shared/models/facility/facility-service.model';
import { BookDataSharingService } from './book-data-sharing.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', opacity: '0', overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: '1', overflow: 'visible' })),
      transition('collapsed => expanded', animate('300ms ease-in')),
      transition('expanded => collapsed', animate('300ms ease-out'))
    ])
  ]
})
export class BookCategoryComponent implements OnChanges {
  @Input() serviceCategories: ServiceCategoryResponse[] = [];
  categoryStates: { [key: string]: string } = {};
  public truncationLength: number;
  public isDesktopView: any;

  demoName = 'Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur.'

  constructor(
    private stepper: MatStepper,
    private bookDataSharingService: BookDataSharingService,
  ) {
    // Set initial truncation length based on the window width
    this.truncationLength = window.innerWidth < 768 ? 25 : 25;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event): void {
    // Adjust truncation length based on window width
    this.truncationLength = window.innerWidth < 768 ? 25 : 25;
    this.isDesktopView = window.innerWidth < 768;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Initialize categoryStates after loading the categories
    if (this.serviceCategories && this.serviceCategories.length > 0) {
      this.serviceCategories.forEach(category => this.categoryStates[category.id] = 'collapsed');
    }
  }

  toggleServiceDetails(event: Event, category): void {
    event.stopPropagation();

    // Toggle the state of category's details between expanded and collapsed
    this.categoryStates[category.id] = this.categoryStates[category.id] === 'expanded' ? 'collapsed' : 'expanded';
  }

  categorySelect(categoryId: any) {
    this.bookDataSharingService.updateData(categoryId);
    this.stepper.next();
  }
}
