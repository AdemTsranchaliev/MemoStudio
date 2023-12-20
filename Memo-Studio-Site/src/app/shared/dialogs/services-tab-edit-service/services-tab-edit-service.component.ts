import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-services-tab-edit-service',
  templateUrl: './services-tab-edit-service.component.html',
  styleUrls: ['./services-tab-edit-service.component.css']
})
export class ServicesTabEditServiceComponent implements OnInit {
  public addServiceForm: FormGroup = this.formBuilder.group({
    newService: ["", [Validators.required]],
    newPrice: ["", [Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ServicesTabEditServiceComponent>,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (this.data.isServiceEdit) {
      this.addServiceForm.get('newService').setValue(this.data.service);
      this.addServiceForm.get('newPrice').setValue(this.data.price);
    }
  }

  onSubmit() {
    if (this.addServiceForm.invalid) {
      return;
    }

    const { newService, newPrice } = this.addServiceForm.value;

    if (newService != '' && newPrice != '') {
      this.dialogRef.close({ newService, newPrice });
    } else {
      // User clicked the Save button without entering content
      this.dialogRef.close(null);
    }
  }
}
