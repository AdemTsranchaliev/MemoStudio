import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-services-tab-edit-service',
  templateUrl: './services-tab-edit-service.component.html',
  styleUrls: ['./services-tab-edit-service.component.css']
})
export class ServicesTabEditServiceComponent implements OnInit {
  public addServiceForm: FormGroup = this.formBuilder.group({
    newService: ["", [Validators.required]],
    newPrice: ["", [Validators.required]],
    newDuration: ["", [Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ServicesTabEditServiceComponent>,
    private formBuilder: FormBuilder,
    public utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    if (this.data.isServiceEdit) {
      this.addServiceForm.get('newService').setValue(this.data.service.name);
      this.addServiceForm.get('newPrice').setValue(this.data.service.price);
      this.addServiceForm.get('newDuration').setValue(this.data.service.duration);
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
