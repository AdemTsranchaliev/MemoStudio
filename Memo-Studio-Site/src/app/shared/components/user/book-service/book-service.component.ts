import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { MatStepper } from "@angular/material/stepper";
import { ServiceCategoryResponse, ServiceResponse } from "src/app/shared/models/facility/facility-service.model";
import { BookDataSharingService } from "../book-category/book-data-sharing.service";
import { Subscription } from "rxjs";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: "app-book-service",
  templateUrl: "./book-service.component.html",
  styleUrls: ["./book-service.component.css"],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', opacity: '0', overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: '1', overflow: 'visible' })),
      transition('collapsed => expanded', animate('300ms ease-in')),
      transition('expanded => collapsed', animate('300ms ease-out'))
    ])
  ]
})
export class BookServiceComponent implements OnInit, OnChanges, OnDestroy {
  private subscriptions: Subscription[] = [];
  serviceStates: { [key: string]: string } = {};

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() serviceCategories: ServiceCategoryResponse[] = [];
  currentCategoryId: any;
  public services: ServiceResponse[] = [];
  public truncationLength: number;
  public isDesktopView: any;

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

        // Initialize serviceStates after loading the services
        this.services.forEach(service => this.serviceStates[service.id] = 'collapsed');
      }
    }
  }

  toggleServiceDetails(event: Event, service): void {
    event.stopPropagation();

    // Toggle the state of service's details between expanded and collapsed
    this.serviceStates[service.id] = this.serviceStates[service.id] === 'expanded' ? 'collapsed' : 'expanded';
  }

  nextStep() {
    this.stepper.next();
  }
}
