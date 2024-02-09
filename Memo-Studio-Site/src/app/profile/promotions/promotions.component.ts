import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  public promotionsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.promotionsForm = this.formBuilder.group({
      emailSubject: ["", Validators.required],
      emailMessage: ["", Validators.required],
    });
  }

  public onSubmit() {

  }
}
