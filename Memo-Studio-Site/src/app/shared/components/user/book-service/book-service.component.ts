import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { MatStepper } from "@angular/material/stepper";
import { ServiceCategoryResponse, ServiceResponse } from "src/app/shared/models/facility/facility-service.model";

@Component({
  selector: "app-book-service",
  templateUrl: "./book-service.component.html",
  styleUrls: ["./book-service.component.css"],
})
export class BookServiceComponent implements OnChanges {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() serviceCategories: ServiceCategoryResponse[] = [];
  public services: ServiceResponse[] = [];
  constructor(private stepper: MatStepper) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.services = this.serviceCategories[1].services; // remove as some point

    // if (this.serviceCategories) {
    //   let index = this.serviceCategories.findIndex(x => x.id == 33);

    //   if (index != -1) {
    //     this.services = this.serviceCategories[index]?.services;
    //   }
    // }
  }

  nextStep() {
    this.stepper.next();
  }
}
