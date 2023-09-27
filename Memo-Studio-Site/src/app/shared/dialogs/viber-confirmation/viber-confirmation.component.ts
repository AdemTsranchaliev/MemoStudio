import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ViberService } from '../../services/viber.service';

@Component({
  selector: 'app-viber-confirmation',
  templateUrl: './viber-confirmation.component.html',
  styleUrls: ['./viber-confirmation.component.css']
})
export class ViberConfirmationComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  viberConfirmation: any = {};
  viberConfirmationForm: FormGroup;
  timer: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private router: Router,
    private viberService: ViberService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const confirmationSubscription = this.viberService.getViberConfirmationCode().subscribe({
      next: (x) => {
        this.viberConfirmation = x;

        const code = this.viberConfirmation.code.split('');
        this.viberConfirmationForm.patchValue({
          inputFirst: code[0] || "",
          inputSecond: code[1] || "",
          inputThird: code[2] || "",
          inputFourth: code[3] || "",
          inputFifth: code[4] || "",
          inputSixth: code[5] || ""
        });

        // Calculate the remaining time in milliseconds
        const validToTimestamp = new Date(this.viberConfirmation.validTo).getTime();
        const currentTimestamp = new Date().getTime();
        this.timer = validToTimestamp - currentTimestamp;

        // Start the countdown timer
        const countdown$ = timer(0, 1000).pipe(
          takeWhile(() => this.timer > 0)
        );

        countdown$.subscribe(() => {
          this.timer -= 1000; // Decrease the timer by 1 second (1000 ms)

          if (this.timer <= 0) {
            this.timer = 0;
          }
        });
      },
      error: (err) => {
        console.error(err);
      },
    })
    this.subscriptions.push(confirmationSubscription);

    this.createViberForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  createViberForm() {
    this.viberConfirmationForm = this.formBuilder.group({
      inputFirst: ["", [Validators.required, isNumberValidator()]],
      inputSecond: ["", [Validators.required, isNumberValidator()]],
      inputThird: ["", [Validators.required, isNumberValidator()]],
      inputFourth: ["", [Validators.required, isNumberValidator()]],
      inputFifth: ["", [Validators.required, isNumberValidator()]],
      inputSixth: ["", [Validators.required, isNumberValidator()]],
    });

    this.viberConfirmationForm.disable();
  }

  public onSubmit() { // Not shure where to validate the code! For now will stay!
    if (this.viberConfirmationForm.invalid) {
      return;
    }

    // Fetch
    var model = Object.assign({}, this.viberConfirmationForm.value);
    console.log('>>>>', model);

    // Navigate
  }

  public copiedCodeMsg() {
    this.snackBar.open('Кода бе копиран успешно!', 'Затвори', {
      duration: 8000,
      panelClass: ["custom-snackbar"],
    });
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