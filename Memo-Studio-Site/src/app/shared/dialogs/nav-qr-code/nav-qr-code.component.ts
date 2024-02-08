import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthenticatinService } from "../../services/authenticatin.service";
import { Observable, Subscription } from "rxjs";
import { BreakpointObserver, BreakpointState, Breakpoints } from "@angular/cdk/layout";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-nav-qr-code",
  templateUrl: "./nav-qr-code.component.html",
  styleUrls: ["./nav-qr-code.component.css"],
})
export class NavQrCodeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public facilityLink: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);
  public currentSize: string;
  public viewSize: number = 180;

  constructor(
    public dialogRef: MatDialogRef<NavQrCodeComponent>,
    private authService: AuthenticatinService,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.facilityLink = `https://localhost:4200/#/facility-schedule/${this.authService.getFacilityId()}`;

    this.manageQRCodeSize();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  public copyLink() {
    // Copy the facility link to the clipboard
    navigator.clipboard.writeText(this.facilityLink)
      .then(() => {
        this.snackBar.open('Успешно копирахте линка!', "Затвори", {
          duration: 8000,
          panelClass: ["custom-snackbar"],
        });
      })
      .catch((error) => {
        this.snackBar.open('Нещо се обърка, моля опитайте отново!', "Затвори", {
          duration: 8000,
          panelClass: ["custom-snackbar"],
        });
      });
  }

  public manageQRCodeSize(): void {
    const isViewSmallSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        this.viewSize = 200;
      } else {
        this.viewSize = 280;
      }
    });
    this.subscriptions.push(isViewSmallSubscription);
  }
}
