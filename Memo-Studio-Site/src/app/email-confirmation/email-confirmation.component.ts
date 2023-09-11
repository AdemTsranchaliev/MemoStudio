import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {
  isLoading: boolean;
  isConfirmedSuccess: boolean = false;
  isConfirmedFail: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.setLoader(true);
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (!token) {
      // ========== When new Page ready navigate there ==========
      // this.router.navigate(["/"]);
    }

    this.http.post("https://localhost:7190/api/User/EmailConfirmation", { email: email, token: token }).subscribe({
      next: (x) => {
        console.log('>>> Response', x)
        this.setLoader(false);
        this.isConfirmedSuccess = true;
      },
      complete: () => {
        this.setLoader(false);
        this.isConfirmedSuccess = true;

        this.snackBar.open('Пренасочване към началната страница', 'Затвори', {
          duration: 5000,
        });
      },
      error: (err: Error) => {
        this.setLoader(false);
        this.isConfirmedFail = true;
        this.isConfirmedSuccess = false;

        this.snackBar.open('Имейлът НЕ беше потвърден успешно!', 'Затвори', {
          duration: 8000,
        });
        console.log('>>> Error', err)
      },
    })
  }

  setLoader(condition: boolean): void {
    if (condition) {
      this.isLoading = true;
    }

    this.isLoading = false;
  }
}
