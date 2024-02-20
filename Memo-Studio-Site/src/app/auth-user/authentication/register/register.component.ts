import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthenticatinService } from "src/app/shared/services/authenticatin.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthenticationComponent } from "../authentication.component";
import { MatSnackBar } from "@angular/material/snack-bar";

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get("password").value;
  const confirmPassword = control.get("confirmPassword").value;

  if (password !== confirmPassword) {
    return { passwordMismatch: true }; // Return an object with the error key
  } else {
    return null;
  }
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  public isLoginError: boolean = false;
  public registerForm: FormGroup = this.formBuilder.group(
    {
      name: ["", Validators.required],
      surname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
      phone: ["", Validators.required],
      acceptPolicy: [false, Validators.required],
    },
    { validator: passwordMatchValidator }
  );

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticatinService,
    public utilityService: UtilityService,
    private parentComponent: AuthenticationComponent,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // if (this.authService.isAuthenticated()) {
    //   this.router.navigate(["/"]);
    // }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    let model = Object.assign({}, this.registerForm.value);
    const loginSubscription = this.authService.register(model).subscribe({
      next: (x: string) => {
        this.registerForm.reset();
        this.snackBar.open("Регистрацията Ви бе успешна!", "Затвори", {
          duration: 8000,
          panelClass: ["custom-snackbar"],
        });
        this.isLoading = false;
        this.parentComponent.setSelectedTabIndex(0);
      },
      error: (err) => {
        this.isLoginError = true;
        this.isLoading = false;
        this.snackBar.open(err, "Затвори", {
          duration: 8000,
          panelClass: ["custom-snackbar"],
        });
      },
    });
    this.subscriptions.push(loginSubscription);
  }
}
