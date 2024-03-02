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
    newDescription: [""],
  });

  durationArr: any[] = [
    { duration: "30", value: 30 },
    { duration: "1", value: 60 },
    { duration: "1:30", value: 90 },
    { duration: "2", value: 120 },
    { duration: "2:20", value: 150 },
    { duration: "3", value: 180 },
  ];

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
      this.addServiceForm.get('newDescription').setValue(this.data.service.description);
    }
  }

  onSubmit() {
    if (this.addServiceForm.invalid) {
      return;
    }

    const { newService, newPrice, newDuration, newDescription } = this.addServiceForm.value;

    if (newService != '' && newPrice != null) {
      this.dialogRef.close({ newService, newPrice, newDuration, newDescription });
    } else {
      // User clicked the Save button without entering content
      this.dialogRef.close(null);
    }
  }
}
