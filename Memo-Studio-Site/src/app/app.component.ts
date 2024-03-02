import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { LoaderService } from "./shared/services/loader.service";
import { FacilityService } from "./shared/services/facility.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  token = "";

  constructor(
    private globalLoaderService: LoaderService,
    private facilityService: FacilityService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Subscribe to the loader state
    this.globalLoaderService.getLoaderState().subscribe((isLoading) => {
      // Trigger change detection manually to update the view
      this.cdRef.detectChanges();
    });

    // Show the loader globally
    this.globalLoaderService.showLoader();

    // Simulate a delay and then hide the loader
    setTimeout(() => {
      this.globalLoaderService.hideLoader();
    }, 1000);

    this.facilityService.getFacilitySettings().subscribe((x) => {
      const jsonString = JSON.stringify(x);
      localStorage.setItem("GLOBAL_CALENDAR_SETTINGS", jsonString);
    });
  }

  public getNameEmployee() {
    if (localStorage.getItem("clientId") == "1") {
      return "Мемо";
    } else {
      return "Стела";
    }
  }

  public logout() {
    localStorage.removeItem("clientId");
    location.reload();
  }
}
