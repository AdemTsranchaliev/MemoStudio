import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Subscription, Observable } from "rxjs";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { ViberConfirmationComponent } from "src/app/shared/dialogs/viber-confirmation/viber-confirmation.component";
import { AccountService } from "src/app/shared/services/account.service";
import { NotificationSettings } from "src/app/shared/models/account/notification-settings.model";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationComponent implements OnInit {
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.XSmall
  );
  sliderValue = 50; // Initialize the selected value
  settings: NotificationSettings = {
    allowEmailNotification: false,
    allowViberNotification: false,
    email: '',
    isViberSetUp: false,
  };

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.getNotificationSettings().subscribe(x => {
      this.settings = x;
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
    console.log('>>>> YES');
    
  }
}
