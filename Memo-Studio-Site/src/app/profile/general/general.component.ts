import { AfterViewInit, Component, OnInit, Input } from "@angular/core";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { ImgPreviewComponent } from "src/app/shared/dialogs/img-preview/img-preview.component";
import { HttpClient } from "@angular/common/http";
import { BASE_URL_DEV } from "src/app/shared/routes";
import { AccountService } from "src/app/shared/services/account.service";

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.css"],
})
export class GeneralComponent implements OnInit, AfterViewInit {
  private subscriptions: Subscription[] = [];
  private newProfileImg: string;
  @Input() user: AccountViewModel;
  base64Image: string = ""; // Initialize as an empty string

  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);
  private currentSize: string;
  public showPage: boolean = false;

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private accountService: AccountService,
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showPage = true;
    }, 1);
  }

  ngOnInit(): void {
    // this.http.get<string>(`${BASE_URL_DEV}/account/profile-picture`).subscribe((response) => {
    //   this.base64Image = response;
    // });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  openDialog() {
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
      // ============== When API ready use the new image ==============
      this.newProfileImg = result.changingThisBreaksApplicationSecurity;
    });
  }

  saveGeneralInformation() {
    console.log('>>>', this.user);

    // const generalSubscription = this.accountService.setUserInformation({}).subscribe(res => {
    //   console.log('>>>', res);

    // });
    // this.subscriptions.push(generalSubscription);
  }
}

export interface AccountViewModel {
  name: string;
  surname: string;
  email: string;
  facilityName: string;
  phone: string;
  profilePictureBase64: string;
}

export interface CalendarProfileInformation {
  name: string;
  imageBase64: string;
}
