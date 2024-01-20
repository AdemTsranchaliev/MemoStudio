import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { ServicesTabCreateCategoryComponent } from "src/app/shared/dialogs/services-tab-create-category/services-tab-create-category.component";
import { ServicesTabEditServiceComponent } from "src/app/shared/dialogs/services-tab-edit-service/services-tab-edit-service.component";
import { CreateServiceComponent } from "src/app/shared/dialogs/create-service/create-service.component";
import { HttpClient } from "@angular/common/http";
import { BASE_URL_DEV } from "src/app/shared/routes";

@Component({
  selector: "app-services-tab",
  templateUrl: "./services-tab.component.html",
  styleUrls: ["./services-tab.component.css"],
})
export class ServicesTabComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() hasHeader: boolean;

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  categoriesSelect: string[] = [
    "Дамско подстригване",
    "Мъжко подстригване",
    "Детско подстригване",
  ];

  serviceCategories = [];

  categories = [
    {
      id: 1,
      category: "Мъжко подстригване",
      services: [
        { id: 1, name: "Оформяне на коса", price: 3 },
        { id: 2, name: "Оформяне на брада", price: 33 },
      ],
    },
    {
      id: 2,
      category: "Дамско подстригване",
      services: [
        { id: 1, name: "Миене коса", price: 23 },
        { id: 2, name: "Боядисване на коса", price: 73 },
      ],
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${BASE_URL_DEV}/facility/service`).subscribe(
      (response) => {
        this.serviceCategories = response;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  onAddService() {
    console.log(1);
    const dialogRef = this.dialog.open(CreateServiceComponent, {
      width: "100vw",
      data: {
        categories: this.categories,
        categoriesSelect: this.categoriesSelect,
      },
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
      if (result.categories) {
        this.categories = result.categories;
        this.categoriesSelect = result.categoriesSelect;
      }
    });
  }

  // ================ Edit/Delete Category ================
  editCategory(category: any) {
    const dialogRef = this.dialog.open(ServicesTabCreateCategoryComponent, {
      width: "100vw",
      data: { category: category.category, isCategoryEdit: true }, // Pass the category data and indicate it's for editing
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Find the index of the edited category in the array
        const index = this.categories.findIndex((c) => c.id === category.id);

        if (index !== -1) {
          // Update the category with the edited data
          this.categories[index].category = result;
        }

        // Update the categoriesSelect with the edited data
        const selectedCatIndex = this.categoriesSelect.findIndex(
          (c) => c === category.category
        );
        if (selectedCatIndex !== -1) {
          this.categoriesSelect[selectedCatIndex] = result;
        }
      }
    });
  }

  deleteCategory(category: any) {
    // Find the index of the category to delete
    const index = this.categories.findIndex((c) => c.id === category.id);

    if (index !== -1) {
      // Remove the category from the array
      this.categories.splice(index, 1);
    }
  }

  // ================ Edit/Delete Service ================
  editService(category: any, service: any) {
    const dialogRef = this.dialog.open(ServicesTabEditServiceComponent, {
      width: "100vw",
      data: {
        service: service.name,
        price: service.price,
        isServiceEdit: true,
      },
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
      if (!result) {
        return;
      }

      // Find the index of the edited service in the category
      const categoryIndex = this.categories.findIndex(
        (c) => c.id === category.id
      );
      const serviceIndex = this.categories[categoryIndex].services.findIndex(
        (s) => s.id === service.id
      );

      if (categoryIndex !== -1 && serviceIndex !== -1) {
        // Update the service with the edited data
        this.categories[categoryIndex].services[serviceIndex].name =
          result.newService;
        this.categories[categoryIndex].services[serviceIndex].price =
          result.newPrice;
      }
    });
  }

  deleteService(category: any, service: any) {
    // Find the index of the category and service to delete
    const categoryIndex = this.categories.findIndex(
      (c) => c.id === category.id
    );
    const serviceIndex = this.categories[categoryIndex].services.findIndex(
      (s) => s.id === service.id
    );

    if (categoryIndex !== -1 && serviceIndex !== -1) {
      // Remove the service from the category
      this.categories[categoryIndex].services.splice(serviceIndex, 1);
    }
  }
}
