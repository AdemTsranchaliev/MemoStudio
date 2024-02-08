import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import { mergeMap } from "rxjs/operators";
import { FacilityService } from "../../services/facility.service";
import { FacilityInformationViewModel } from "../../models/facility/facility-information.model";
import { AuthenticatinService } from "../../services/authenticatin.service";
import { BASE_URL_DEV } from "../../routes";
import { NavigateService } from "../../services/navigate.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-user-subscription",
  templateUrl: "./user-subscription.component.html",
  styleUrls: ["./user-subscription.component.css"],
})
export class UserSubscriptionComponent implements OnInit, AfterViewInit {
  @ViewChild("trigger") trigger: MatMenuTrigger;
  triggerAnimation = false;

  public facility: FacilityInformationViewModel;

  constructor(
    public navigateService: NavigateService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        mergeMap((params) => {
          const id = params.get("id");
          return this.facilityService.getFacilityInformation(id);
        })
      )
      .subscribe(
        (result) => {
          this.facility = result;
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }

  ngAfterViewInit(): void {
    if (!this.triggerAnimation) {
      this.triggerBounceAnimation();
      this.triggerAnimation = true;
      this.cdr.detectChanges();
    }
  }

  public copyLink() {
    // Get the current URL
    const currentUrl = window.location.href;

    // Copy the current URL to the clipboard
    navigator.clipboard.writeText(currentUrl)
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

  private triggerBounceAnimation(): void {
    const icons = document.querySelectorAll(".bounce");
    icons.forEach((icon, index) => {
      // You can adjust the delay based on your preference
      const delay = 0.1 * index; // 0.1s delay for each icon
      icon.setAttribute(
        "style",
        `animation: bounce 2s ease infinite; animation-delay: ${delay}s;`
      );
    });
  }
}
