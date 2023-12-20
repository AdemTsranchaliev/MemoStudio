import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-book-service',
  templateUrl: './book-service.component.html',
  styleUrls: ['./book-service.component.css']
})
export class BookServiceComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  servicesArr = [
    'Lorem, ipsum.',
    'Lorem, ipsum.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem, ipsum.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem, ipsum.',
    'Lorem, ipsum.',
    'Lorem ipsum dolor sit amet consectetur.',
    'Lorem, ipsum.',
    'Lorem ipsum dolor sit amet consectetur.',
  ];

  constructor(
    private stepper: MatStepper,
  ) { }

  ngOnInit(): void {
  }

  nextStep() {
    this.stepper.next();
  }
}
