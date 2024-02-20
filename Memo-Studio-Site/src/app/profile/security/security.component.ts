import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import {
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthenticatinService } from "src/app/shared/services/authenticatin.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.css"],
})
export class SecurityComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  public passwordChangeForm: FormGroup;

  constructor(
    private authenticatinService: AuthenticatinService,
    private snackBar: MatSnackBar,
    public utilityService: UtilityService,
  ) {
    this.initForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public changePassword() {
    if (this.passwordChangeForm.valid) {
      const passwordSubscription = this.authenticatinService
        .changeForgottenPassword(this.passwordChangeForm.value)
        .subscribe(
          (succses) => {
            this.snackBar.open("Паролата беше успешно сменена!", "Затвори", {
              duration: 8000,
              panelClass: ["custom-snackbar"],
            });
            this.initForm();
          },
          (err) => {
            this.snackBar.open(
              "Паролата НЕ беше сменена успешно! Моля опитайте отново!",
              "Затвори",
              {
                duration: 8000,
                panelClass: ["custom-snackbar"],
              }
            );
          }
        );
      this.subscriptions.push(passwordSubscription);
    }
  }

  private initForm() {
    this.passwordChangeForm = new FormGroup(
      {
        oldPassword: new FormControl("", Validators.required),
        newPassword: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmNewPassword: new FormControl("", Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get("newPassword").value;
    const confirmNewPassword = formGroup.get("confirmNewPassword").value;

    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }
}
