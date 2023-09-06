import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthenticatinService } from "../../../shared/services/authenticatin.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  // Subscriptions
  private subscriptions: Subscription[] = [];
  public isLoginError: boolean = false;
  public loginForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(3)]],
    rememberMe: [false],
  });

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
