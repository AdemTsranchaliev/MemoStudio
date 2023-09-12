import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthenticatinService } from "src/app/shared/services/authenticatin.service";

@Component({
  selector: "app-forgotten-password",
  templateUrl: "./forgotten-password.component.html",
  styleUrls: ["./forgotten-password.component.css"],
})
export class ForgottenPasswordComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public requestStatus: number = 0;

  public forgottenPasswordForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthenticatinService) {}

  ngOnInit(): void {}

  public onSubmit() {
    if (this.forgottenPasswordForm.invalid) {
      return;
    }

    var model = Object.assign({}, this.forgottenPasswordForm.value);

    this.requestStatus = -1;
    this.authService.forgottenPassword(model).subscribe({
      next: () => {
        this.requestStatus = 1;
      },
      error: (err) => {
        this.requestStatus = 2;
      },
    });
  }
}
