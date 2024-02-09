import { Component, OnInit, OnDestroy, Input, HostListener } from "@angular/core";
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
import { FacilityService } from "src/app/shared/services/facility.service";
import { UpsertServiceCategory } from "src/app/shared/models/facility/upsert-service-category.model";
import { CancelMessageDialogComponent } from "src/app/shared/dialogs/cancel-message/cancel-message.component";
import { ServiceResponse } from "src/app/shared/models/facility/facility-service.model";
import { MatSnackBar } from "@angular/material/snack-bar";

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

  public serviceCategories: any = [];
  public truncationLength: number;
  public isDesktopView: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private facilityService: FacilityService,
    private snackBar: MatSnackBar,
  ) {
    // Set initial truncation length based on the window width
    this.truncationLength = window.innerWidth < 768 ? 16 : 70;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event): void {
    // Adjust truncation length based on window width
    this.truncationLength = window.innerWidth < 768 ? 16 : 70;
    this.isDesktopView = window.innerWidth < 768;
  }

  ngOnInit(): void {
    this.facilityService.getFacilityServices().subscribe(
      (response) => {
        this.serviceCategories = response;
      },
      (err) => {
        this.snackBar.open(err, "Затвори", {
          duration: 8000,
          panelClass: ["custom-snackbar"],
        });
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public onAddService() {
    const dialogRef = this.dialog.open(CreateServiceComponent, {
      width: "100vw",
      data: {
        categories: this.serviceCategories,
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
      if (result && result.categories) {
        // this.categories = result.categories;
        // this.categoriesSelect = result.categoriesSelect;
        this.snackBar.open("Услугата беше създадена.", "Затвори", {
          duration: 8000,
          panelClass: ["custom-snackbar"],
        });
      }
    });
  }

  // ================ Edit Category ================
  public editCategory(categoryId: any) {
    const dialogRef = this.dialog.open(ServicesTabCreateCategoryComponent, {
      width: "100vw",
      data: {
        categoryId: categoryId,
        categories: this.serviceCategories,
        isCategoryEdit: true,
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
      if (result) {
        let modelToSend = <UpsertServiceCategory>{
          id: categoryId,
          name: result,
        };
        this.facilityService.upsertServiceCategory(modelToSend).subscribe(
          (success) => {
            let index = this.serviceCategories.findIndex(
              (x) => x.id == categoryId
            );
            if (index >= 0) {
              this.serviceCategories[index].name = result;
              this.snackBar.open("Категорията беше редактирана.", "Затвори", {
                duration: 8000,
                panelClass: ["custom-snackbar"],
              });
            }
          },
          (err) => {
            this.snackBar.open(err, "Затвори", {
              duration: 8000,
              panelClass: ["custom-snackbar"],
            });
          }
        );
      }
    });
  }

  // ================ Delete Category ================
  public deleteCategory(categoryId: number) {
    const dialogRef = this.dialog.open(CancelMessageDialogComponent, {
      width: "100vw",
      data: {
        dialogTitle: 'Внимание',
        dialogTitleStyle: 'text-danger',
        dialogMessageContent: ['Сигурни ли сте, че искате да изтриете тази категория?'],
        dialogCancelBtnContent: 'Изтриване',
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

    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        // Find the index of the category to delete
        const index = this.serviceCategories.findIndex((c) => c.id === categoryId);

        if (index !== -1) {
          this.facilityService.removeCategory(categoryId).subscribe(
            (success) => {
              this.serviceCategories.splice(index, 1);
              this.snackBar.open("Категорията беше изтрита.", "Затвори", {
                duration: 8000,
                panelClass: ["custom-snackbar"],
              });
            },
            (err) => {
              this.snackBar.open(err, "Затвори", {
                duration: 8000,
                panelClass: ["custom-snackbar"],
              });
            }
          );
        }
      }
    });
  }

  // ================ Edit Service ================
  public editService(category: any, service: any) {
    const dialogRef = this.dialog.open(ServicesTabEditServiceComponent, {
      width: "100vw",
      data: {
        service: service,
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

      let modelToSend = <ServiceResponse>{
        id: service.id,
        name: result.newService,
        price: result.newPrice,
        description: '',
        duration: result.newDuration,
        facilityId: category.facilityId,
        serviceCategoryId: service.serviceCategoryId,
      };

      // this.facilityService.upsertServiceCategory(modelToSend).subscribe(
      //   (success) => {
      //     let index = this.serviceCategories.findIndex(
      //       (x) => x.services.id == service.id
      //     );
      //     if (index >= 0) {
      //       this.serviceCategories.services[index].name = result.newService;
      //       this.serviceCategories.services[index].price = result.newPrice;
      //       this.serviceCategories.services[index].duration = result.newDuration;
      // this.snackBar.open("Услугата беше редактирана.", "Затвори", {
      //   duration: 8000,
      //   panelClass: ["custom-snackbar"],
      // });
      //     }
      //   },
      //   (err) => {
      // this.snackBar.open(err, "Затвори", {
      //   duration: 8000,
      //   panelClass: ["custom-snackbar"],
      // });
      //   }
      // );
    });
  }

  // ================ Delete Service ================
  public deleteService(categoryId: number, serviceId: number) {
    const dialogRef = this.dialog.open(CancelMessageDialogComponent, {
      width: "100vw",
      data: {
        dialogTitle: 'Внимание',
        dialogTitleStyle: 'text-danger',
        dialogMessageContent: ['Сигурни ли сте, че искате да изтриете тази услуга?'],
        dialogCancelBtnContent: 'Изтриване',
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

    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        const categoryIndex = this.serviceCategories.findIndex(
          (c) => c.id === categoryId
        );

        if (categoryId >= 0) {
          const serviceIndex = this.serviceCategories[
            categoryIndex
          ].services.findIndex((s) => s.id === serviceId);

          if (serviceIndex >= 0) {
            this.facilityService.removeService(serviceId).subscribe(
              (success) => {
                this.serviceCategories[categoryIndex].services.splice(
                  serviceIndex,
                  1
                );
                this.snackBar.open("Услугата беше изтрита!", "Затвори", {
                  duration: 8000,
                  panelClass: ["custom-snackbar"],
                });
              },
              (err) => {
                this.snackBar.open(err, "Затвори", {
                  duration: 8000,
                  panelClass: ["custom-snackbar"],
                });
              }
            );
          }
        }
      }
    });
  }
}
