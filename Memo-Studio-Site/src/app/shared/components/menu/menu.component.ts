import { Component, OnInit } from "@angular/core";
import { AuthenticatinService } from "../../services/authenticatin.service";
import { BreakpointObserver, BreakpointState, Breakpoints } from "@angular/cdk/layout";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { NavQrCodeComponent } from "../../dialogs/nav-qr-code/nav-qr-code.component";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(
    public authService: AuthenticatinService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
  }

  public openDialog() {
    const dialogRef = this.dialog.open(NavQrCodeComponent, {
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

    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }
}
