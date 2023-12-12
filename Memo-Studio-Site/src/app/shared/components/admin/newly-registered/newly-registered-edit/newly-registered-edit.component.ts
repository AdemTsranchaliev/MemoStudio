import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newly-registered-edit',
  templateUrl: './newly-registered-edit.component.html',
  styleUrls: ['./newly-registered-edit.component.css']
})
export class NewlyRegisteredEditComponent implements OnInit {
  public newlyRegisteredEditForm: FormGroup = this.formBuilder.group({
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
    phone: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }


  ngOnInit(): void {
  }

  onSubmit() {
    if (this.newlyRegisteredEditForm.invalid) {
      return;
    }

    const model = Object.assign({}, this.newlyRegisteredEditForm.value);
    console.log('>>> Submited', model);
  }

  onApproveClick() {
    console.log('>>> Approved');
  }

  onRejectClick() {
    console.log('>>> Reject');
  }

  navigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}
