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
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
  ) {}

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

  public navigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}
