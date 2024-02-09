import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { ServicesTabCreateCategoryComponent } from "../services-tab-create-category/services-tab-create-category.component";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { HttpClient } from "@angular/common/http";
import { BASE_URL_DEV } from "../../routes";
import { FacilityService } from "../../services/facility.service";
import { UpsertServiceCategory } from "../../models/facility/upsert-service-category.model";
import { UtilityService } from "../../services/utility.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-create-service",
  templateUrl: "./create-service.component.html",
  styleUrls: ["./create-service.component.css"],
})
export class CreateServiceComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  public createServiceForm: FormGroup = this.formBuilder.group({
    name: ["", [Validators.required]],
    price: ["", [Validators.required]],
    serviceCategoryId: [0, [Validators.required]],
    duration: [60, [Validators.required]],
    description: [""],
  });

  public categories: any[] = [];
  public durationArr: any[] = [
    { duration: "30 минути", value: 30 },
    { duration: "60 минути", value: 60 },
    { duration: "90 минути", value: 90 },
    { duration: "120 минути", value: 120 },
    { duration: "150 минути", value: 150 },
    { duration: "180 минути", value: 180 },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateServiceComponent>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient,
    private facilityService: FacilityService,
    private breakpointObserver: BreakpointObserver,
    public utilityService: UtilityService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.categories = this.data.categories;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public onCategoryChange() {
    const selectedCategory =
      this.createServiceForm.get("serviceCategoryId").value;
    if (selectedCategory == -1) {
      this.addNewCategory();
    }
  }

  public onAddService() {
    if (this.createServiceForm.invalid) {
      return;
    }

    this.http
      .post(`${BASE_URL_DEV}/facility/service`, this.createServiceForm.value)
      .subscribe(
        (success: any) => {
          let indexToInclude = this.categories.findIndex(
            (x) => x.id == success.serviceCategoryId
          );

          if (indexToInclude >= 0) {
            if (!this.categories[indexToInclude].services?.length) {
              this.categories[indexToInclude].services = [];
            }

            this.categories[indexToInclude].services.push(success);
          }
        },
        (err) => {
          this.snackBar.open(err, "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        }
      );

    this.dialogRef.close({
      categories: this.categories,
    });

    this.createServiceForm.reset();
  }

  private removeCategory(categoryId: number) {

  }

  private addNewCategory() {
    const dialogRef = this.dialog.open(ServicesTabCreateCategoryComponent, {
      width: "100vw",
      data: {},
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

    const closeSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let modelToSend = <UpsertServiceCategory>{ name: result };

        this.facilityService
          .upsertServiceCategory(modelToSend)
          .subscribe({
            next: (x) => {
              this.categories.push(x);
              this.createServiceForm.get("serviceCategoryId").setValue(x.id);
            },
            error: (err) => {
              this.snackBar.open(err, "Затвори", {
                duration: 8000,
                panelClass: ["custom-snackbar"],
              });
            },
          });
      } else {
        this.createServiceForm.get("serviceCategoryId").setValue("");
      }
    });

    this.subscriptions.push(closeSubscription);
  }
}