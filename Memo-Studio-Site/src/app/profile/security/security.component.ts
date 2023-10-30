import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticatinService } from 'src/app/shared/services/authenticatin.service';
import { AccountViewModel } from '../general/general.component';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() user: AccountViewModel;
  passwordChangeForm: FormGroup;

  constructor(
    private authenticatinService: AuthenticatinService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  createForm() {
    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
    });
  }

  changePassword() {
    console.log('>>>', this.user);

    if (this.passwordChangeForm.valid && this.passwordChangeForm.get('newPassword').value == this.passwordChangeForm.get('confirmNewPassword').value) {

      const passwordSubscription = this.authenticatinService.changeForgottenPassword({}).subscribe((res) => {
        console.log('>>>', res);

      });
      this.subscriptions.push(passwordSubscription);
    }
  }
}
