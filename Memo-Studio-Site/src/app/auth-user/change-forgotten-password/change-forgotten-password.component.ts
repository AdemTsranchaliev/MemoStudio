import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthenticatinService } from "src/app/shared/services/authenticatin.service";
import { UtilityService } from "src/app/shared/services/utility.service";

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get("newPassword").value;
  const confirmPassword = control.get("confirmPassword").value;

  if (password !== confirmPassword) {
    control.get("confirmPassword").setErrors({ passwordMismatch: true });
  } else {
    return null;
  }
}

@Component({
  selector: "app-change-forgotten-password",
  templateUrl: "./change-forgotten-password.component.html",
  styleUrls: ["./change-forgotten-password.component.css"],
})
export class ChangeForgottenPasswordComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public requestStatus: number = 0;
  public registerForm: FormGroup = this.formBuilder.group(
    {
      email: ["", [Validators.required]],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
      token: ["", Validators.required],
    },
    { validator: passwordMatchValidator }
  );

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private route: Router,
    private authService: AuthenticatinService,
    public utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    const token = this.router.snapshot.queryParamMap.get("token");
    const email = this.router.snapshot.queryParamMap.get("email");

    if (!token) {
      // ========== When new Page ready navigate there ==========
      this.route.navigate(["/"]);
    }
    this.registerForm.get("email").setValue(email);
    this.registerForm.get("token").setValue(token);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.requestStatus = -1;

    let model = Object.assign({}, this.registerForm.value);
    const loginSubscription = this.authService.resetPassword(model).subscribe({
      next: () => {
        this.requestStatus = 1;
        setTimeout(() => {
          this.route.navigate(["/login"]);
        }, 3000);
      },
      error: (err) => {
        this.requestStatus = 2;
      },
    });
    this.subscriptions.push(loginSubscription);
  }
}
