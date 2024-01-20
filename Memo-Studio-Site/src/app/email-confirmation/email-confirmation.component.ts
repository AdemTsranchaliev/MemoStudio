import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-email-confirmation",
  templateUrl: "./email-confirmation.component.html",
  styleUrls: ["./email-confirmation.component.css"],
})
export class EmailConfirmationComponent implements OnInit {
  isLoading: boolean;
  requestStatus: number = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setLoader(true);
    const token = this.route.snapshot.queryParamMap.get("token");
    const email = this.route.snapshot.queryParamMap.get("email");

    if (!token) {
      this.router.navigate(["/"]);
      return;
    }

    this.http
      .post("https://localhost:7190/api/account/EmailConfirmation", {
        email: email,
        token: token,
      })
      .subscribe({
        next: (x) => {
          console.log(">>> Response", x);
          //this.setLoader(false);
          this.requestStatus = 1;
        },
        error: (err: Error) => {
          //this.setLoader(false);
          this.requestStatus = 2;

          this.snackBar.open("Имейлът НЕ беше потвърден успешно!", "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        },
      });
  }

  setLoader(condition: boolean): void {
    if (condition) {
      this.isLoading = true;
    }

    this.isLoading = false;
  }
}
