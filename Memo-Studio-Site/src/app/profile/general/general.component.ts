import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, BreakpointState, Breakpoints } from "@angular/cdk/layout";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { ImgPreviewComponent } from "src/app/shared/dialogs/img-preview/img-preview.component";

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.css"],
})
export class GeneralComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  currentSize: string;
  newProfileImg: string;

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  openDialog() {
    const dialogRef = this.dialog.open(ImgPreviewComponent, {
      width: "100vw",
      data: { size: this.currentSize }
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe(size => {
      this.currentSize = size.matches ? 'small' : 'large';

      if (size.matches) {
        dialogRef.updateSize('90%');
      } else {
        dialogRef.updateSize('50%');
      }
    });
    this.subscriptions.push(smallDialogSubscription);

    dialogRef.afterClosed().subscribe((result) => {
      // ============== When API ready use the new image ==============
      this.newProfileImg = result.changingThisBreaksApplicationSecurity;
    });
  }
}
