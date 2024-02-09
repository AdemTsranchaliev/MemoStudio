import { Component, OnInit } from "@angular/core";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { ImgPreviewComponent } from "src/app/shared/dialogs/img-preview/img-preview.component";
import { AccountService } from "src/app/shared/services/account.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountViewModel } from "src/app/shared/models/account/account.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.css"],
})
export class GeneralComponent implements OnInit {
  public user: AccountViewModel;
  public formGroup: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    surname: new FormControl("", Validators.required),
    phone: new FormControl("", Validators.required),
    email: new FormControl({ value: "", disabled: true }, Validators.required),
    facilityName: new FormControl("", Validators.required),
  });

  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  private subscriptions: Subscription[] = [];
  private newProfileImg: string;
  private currentSize: string;

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUserInformation();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public openDialog() {
    const dialogRef = this.dialog.open(ImgPreviewComponent, {
      width: "100vw",
      data: { size: this.currentSize },
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
      this.newProfileImg = result?.changingThisBreaksApplicationSecurity;
    });
  }

  public saveGeneralInformation() {
    const generalSubscription = this.accountService
      .updateUserInformation(this.formGroup.value)
      .subscribe({
        next: () => {
          this.getUserInformation();
          this.snackBar.open("Информацията беше запазена успешно!", "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        },
        error: (err) => {
          this.snackBar.open(err, "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        },
      });
    this.subscriptions.push(generalSubscription);
  }

  private getUserInformation() {
    this.accountService.getUserInformation().subscribe((res) => {
      this.user = res;

      this.formGroup.setValue({
        name: this.user.name,
        surname: this.user.surname,
        phone: this.user.phone,
        email: this.user.email,
        facilityName: this.user.facilityName,
      });
    });
  }
}
