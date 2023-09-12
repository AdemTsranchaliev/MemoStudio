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

    this.authService.forgottenPassword(model).subscribe(x=>{
      
    });
  }
}
