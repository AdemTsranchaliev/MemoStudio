import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { ServicesTabCreateCategoryComponent } from '../services-tab-create-category/services-tab-create-category.component';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.css']
})
export class CreateServiceComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  public createServiceForm: FormGroup = this.formBuilder.group({
    serviceName: ["", [Validators.required]],
    price: ["", [Validators.required]],
    category: ["", [Validators.required]],
    time: ["", [Validators.required]],
  });

  categoriesSelect: string[] = [];

  categories = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateServiceComponent>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.categories = this.data.categories;
    this.categoriesSelect = this.data.categoriesSelect;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  onCategoryChange() {
    const selectedCategory = this.createServiceForm.get('category').value;
    if (selectedCategory === 'addCategory') {
      this.addNewCategory();
    }
  }

  addNewCategory() {
    const dialogRef = this.dialog.open(ServicesTabCreateCategoryComponent, {
      width: "100vw",
      data: {}
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        dialogRef.updateSize("90%");
      } else {
        dialogRef.updateSize("50%");
      }
    });
    this.subscriptions.push(smallDialogSubscription);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoriesSelect.push(result);
        this.createServiceForm.get('category').setValue(result);
      } else {
        // Set the default option when no category is added
        this.createServiceForm.get('category').setValue('');
      }
    });
  }

  onAddService() {
    if (this.createServiceForm.invalid) {
      return;
    }

    const { category, price, serviceName } = this.createServiceForm.value;

    // Find the index of the selected category in the categories array
    const categoryIndex = this.categories.findIndex(cat => cat.category === category);

    if (categoryIndex !== -1) {
      // Category exists, push the new service to it
      this.categories[categoryIndex].services.push({
        id: Math.random(),
        name: serviceName,
        price
      });
    } else {
      // Category doesn't exist, create a new category and push the new service to it
      const newCategory = {
        id: Math.random(),
        category: category,
        services: [
          {
            id: Math.random(),
            name: serviceName,
            price
          }
        ]
      };

      this.categories.push(newCategory);
    }

    this.dialogRef.close({ categories: this.categories, categoriesSelect: this.categoriesSelect });

    // Clear the form after adding the service
    this.createServiceForm.reset();
  }
}
