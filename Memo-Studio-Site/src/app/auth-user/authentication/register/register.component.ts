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

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get("password").value;
  const confirmPassword = control.get("confirmPassword").value;

  if (password !== confirmPassword) {
    control.get("confirmPassword").setErrors({ passwordMismatch: true });
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
  // Subscriptions
  private subscriptions: Subscription[] = [];
  public isLoginError: boolean = false;
  public loginForm: FormGroup = this.formBuilder.group(
    {
      name: ["", Validators.required],
      surname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
      phone: ["", Validators.required],
    },
    { validator: passwordMatchValidator }
  );

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticatinService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("AUTH_TOKEN")) {
      this.router.navigate(["/"]);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    var model = Object.assign({}, this.loginForm.value);
    const loginSubscription = this.authService.login(model).subscribe({
      next: (x: string) => {
        localStorage.setItem("AUTH_TOKEN", x);
        this.router.navigate(["/"]);
      },
      error: (err) => {
        this.isLoginError = true;
      },
    });
    this.subscriptions.push(loginSubscription);
  }
}
