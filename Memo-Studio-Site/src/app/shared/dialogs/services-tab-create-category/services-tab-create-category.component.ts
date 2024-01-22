import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: "app-services-tab-create-category",
  templateUrl: "./services-tab-create-category.component.html",
  styleUrls: ["./services-tab-create-category.component.css"],
})
export class ServicesTabCreateCategoryComponent implements OnInit {
  public addCategoryForm: FormGroup = this.formBuilder.group({
    newCategory: ["", [Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ServicesTabCreateCategoryComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.data.isCategoryEdit) {
      var index = this.data.categories.findIndex(x=>x.id==this.data.categoryId);
      if(index>=0){
        this.addCategoryForm.get("newCategory").setValue(this.data.categories[index].name);
      }
    }
  }

  public onSubmit() {
    const categoryName = this.addCategoryForm.get("newCategory").value;

    if (categoryName != "") {
      this.dialogRef.close(categoryName);
    } else {
      this.dialogRef.close(null);
    }
  }
}
