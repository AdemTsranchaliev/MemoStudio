import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ViberConfirmationComponent } from 'src/app/shared/dialogs/viber-confirmation/viber-confirmation.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '50%',
    };

    const dialogRef = this.dialog.open(ViberConfirmationComponent, dialogConfig);

    const smallDialogSubscription = this.isExtraSmall.subscribe(size => {
      if (size.matches) {
        dialogRef.updateSize('90%');
      } else {
        dialogRef.updateSize('50%');
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      smallDialogSubscription.unsubscribe();
    });
  }
}
