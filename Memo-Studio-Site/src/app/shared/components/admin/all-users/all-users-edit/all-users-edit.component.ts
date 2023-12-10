import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-users-edit',
  templateUrl: './all-users-edit.component.html',
  styleUrls: ['./all-users-edit.component.css']
})
export class AllUsersEditComponent implements OnInit {
  public userDetailsEditForm: FormGroup = this.formBuilder.group({
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
    if (this.userDetailsEditForm.invalid) {
      return;
    }

    const model = Object.assign({}, this.userDetailsEditForm.value);
    console.log('>>> Submited', model);
  }

  navigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}
