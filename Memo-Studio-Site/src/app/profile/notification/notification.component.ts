import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable } from "rxjs";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { ViberConfirmationComponent } from "src/app/shared/dialogs/viber-confirmation/viber-confirmation.component";
import { AccountService } from "src/app/shared/services/account.service";
import { NotificationSettings } from "src/app/shared/models/account/notification-settings.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationComponent implements OnInit {
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);
  public sliderValue = 50; // Initialize the selected value
  public settings: NotificationSettings = {
    allowEmailNotification: false,
    allowViberNotification: false,
    email: "",
    isViberSetUp: false,
  };

  public notificationForm: FormGroup = this.formBuilder.group({
    email: ["Demo@asdasd.com", [Validators.required, Validators.email]],
  });

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.accountService.getNotificationSettings().subscribe((x) => {
      this.settings = x;
    });
  }

  public saveChanges() {
    this.accountService
      .updateNotificationSettings(this.settings)
      .subscribe({
        next: (x) => {
          console.log(x);
        },
        error: (err) => {
          this.snackBar.open(err, "Затвори", {
            duration: 8000,
            panelClass: ["custom-snackbar"],
          });
        },
      });
  }

  public openDialog() {
    const dialogConfig: MatDialogConfig = {
      width: "50%",
    };

    const dialogRef = this.dialog.open(
      ViberConfirmationComponent,
      dialogConfig
    );

    const smallDialogSubscription = this.isExtraSmall.subscribe((size) => {
      if (size.matches) {
        dialogRef.updateSize("90%");
      } else {
        dialogRef.updateSize("50%");
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      smallDialogSubscription.unsubscribe();
    });
  }

  public openViberLink() {
    console.log(">>>> YES");
  }
}
