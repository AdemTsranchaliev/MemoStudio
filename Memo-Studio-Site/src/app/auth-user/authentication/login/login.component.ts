import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthenticatinService } from "../../../shared/services/authenticatin.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  public isLoginError: boolean = false;
  public showPage: boolean = false;

  public loginForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(3)]],
    rememberMe: [false],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticatinService,
    public utilityService: UtilityService,
    private snackBar: MatSnackBar,
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showPage = true;
    }, 1)
  }

  ngOnInit(): void {
    // if (this.authService.isAuthenticated()) {
    //   this.router.navigate(["/"]);
    // }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    let model = Object.assign({}, this.loginForm.value);
    const loginSubscription = this.authService.login(model).subscribe({
      next: (x: any) => {
        this.authService.setToken(x.token);
        this.isLoading = false;
        if(x.isFirstBussinesLogin){
          this.router.navigate(["/finish-registration"])
        }else{
          this.router.navigate(["/"]);
        }
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
