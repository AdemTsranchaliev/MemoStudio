import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viber-confirmation',
  templateUrl: './viber-confirmation.component.html',
  styleUrls: ['./viber-confirmation.component.css']
})
export class ViberConfirmationComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // get Data
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public viberConfirmationForm: FormGroup = this.formBuilder.group({
    inputFirst: ["", [Validators.required, isNumberValidator()]],
    inputSecond: ["", [Validators.required, isNumberValidator()]],
    inputThrird: ["", [Validators.required, isNumberValidator()]],
    inputFourth: ["", [Validators.required, isNumberValidator()]],
    inputFifth: ["", [Validators.required, isNumberValidator()]],
    inputSixth: ["", [Validators.required, isNumberValidator()]],
  });

  public onSubmit() {
    if (this.viberConfirmationForm.invalid) {
      return;
    }

    // Fetch
    var model = Object.assign({}, this.viberConfirmationForm.value);
    console.log('>>>>', model);

    // Navigate
  }
}

// Custom validator function
export function isNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (isNaN(value) || typeof value !== 'number') {
      // Return an error if the value is not a number
      return { isNumber: true };
    }

    // Return null if the value is a number
    return null;
  };
}