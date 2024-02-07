import { Component, OnInit, HostListener, Input } from "@angular/core";
import { FacilityInformationViewModel } from "src/app/shared/models/facility/facility-information.model";

@Component({
  selector: "app-user-calendar-heading",
  templateUrl: "./user-calendar-heading.component.html",
  styleUrls: ["./user-calendar-heading.component.css"],
})
export class UserCalendarHeadingComponent implements OnInit {
  @Input() showButton: boolean = true;
  @Input() facilityInformation: FacilityInformationViewModel;

  truncationLength: number;

  constructor() {
    // Set initial truncation length based on the window width
    this.truncationLength = window.innerWidth < 768 ? 11 : 19;
  }

  ngOnInit(): void { }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event): void {
    // Adjust truncation length based on window width
    this.truncationLength = window.innerWidth < 768 ? 11 : 19;
  }
}
