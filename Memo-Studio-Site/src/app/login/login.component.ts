import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthenticatinService } from "../shared/services/authenticatin.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  // Subscriptions
  private subscriptions: Subscription[] = [];

  loginForm!: FormGroup;

  public name: string;
  public password: string;
  public error: number = null;

  constructor(
    private formBuilder: FormBuilder,
    private routing: Router,
    private authService: AuthenticatinService
  ) { }

  ngOnInit(): void {
    // this.initLoginForm;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  submit() {
    if (this.name == "memo" && this.password == "_Passw0rd@543") {
      localStorage.setItem("clientId", "1");
      this.routing.navigate(["/booking"]);
    } else if (this.name == "stela" && this.password == "_Passw0rd@543") {
      localStorage.setItem("clientId", "2");
      this.routing.navigate(["/booking"]);
    } else {
      this.error = 1;
    }
  }

  // =========== NEW SERVER LOGIC ===========

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginSubscription = this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.routing.navigate(['/']);
      },
      error: (err) => {
        console.log('>>> Error', err);
      }
    });
    this.subscriptions.push(loginSubscription);
  }
}
