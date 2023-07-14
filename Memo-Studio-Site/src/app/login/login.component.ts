import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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

  public name: string;
  public password: string;
  public error: number = null;

  constructor(
    private http: HttpClient,
    private routing: Router,
    private authService: AuthenticatinService
  ) { }

  ngOnInit(): void { }

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

  onSubmit() {
    // if (this.loginForm.invalid) {
    //   return;
    // }

    // const loginSubscription = this.authService.login(this.loginForm.value).subscribe({
    //   next: () => {
    //     this.routing.navigate(['/']);
    //   },
    //   error: (err) => {
    //     console.log('>>> Error', err);
    //   }
    // });
    // this.subscriptions.push(loginSubscription);
  }
}
