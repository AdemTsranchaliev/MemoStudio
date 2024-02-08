import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { MatStepper } from "@angular/material/stepper";
import { ServiceCategoryResponse, ServiceResponse } from "src/app/shared/models/facility/facility-service.model";
import { BookDataSharingService } from "../book-category/book-data-sharing.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-book-service",
  templateUrl: "./book-service.component.html",
  styleUrls: ["./book-service.component.css"],
})
export class BookServiceComponent implements OnInit, OnChanges, OnDestroy {
  private subscriptions: Subscription[] = [];

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() serviceCategories: ServiceCategoryResponse[] = [];
  currentCategoryId: any;
  public services: ServiceResponse[] = [];
  public truncationLength: number;

  constructor(
    private stepper: MatStepper,
    private bookDataSharingService: BookDataSharingService,
  ) {
    // Set initial truncation length based on the window width
    this.truncationLength = window.innerWidth < 768 ? 60 : 40;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event): void {
    // Adjust truncation length based on window width
    this.truncationLength = window.innerWidth < 768 ? 60 : 40;
  }

  ngOnInit(): void {
    // Subscribe to the shared data observable
    const sharedDatasubscription = this.bookDataSharingService.sharedData$.subscribe((categoryId) => {
      this.currentCategoryId = categoryId;
      this.loadServices();
    });
    this.subscriptions.push(sharedDatasubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Load services when serviceCategories change
    if (changes.serviceCategories) {
      this.loadServices();
    }
  }

  loadServices(): void {
    if (this.serviceCategories && this.currentCategoryId !== undefined) {
      const index = this.serviceCategories.findIndex(x => x.id === this.currentCategoryId);

      if (index !== -1) {
        this.services = this.serviceCategories[index].services;
      }
    }
  }

  nextStep() {
    this.stepper.next();
  }
}
