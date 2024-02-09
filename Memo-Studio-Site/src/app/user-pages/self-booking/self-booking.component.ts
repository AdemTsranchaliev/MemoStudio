import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { SelfBookingService } from "../../shared/services/selfBooking.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-self-booking",
  templateUrl: "./self-booking.component.html",
  styleUrls: ["./self-booking.component.css"],
})
export class SelfBookingComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  timeIntervals: string[] = [];
  nextStep: unknown; // Will be OBJ with the data for the booking!

  constructor(
    private selfBookingService: SelfBookingService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.loadFreeHours();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  private loadFreeHours(): void {
    // ====== When API ready uncomment! =======
    // const loadHoursSubscription = this.selfBookingService.getFreeHours().subscribe({
    // next: (x) => {
    //   this.timeIntervals = x;
    // },
    // error: (err) => {
    //   this.snackBar.open(err, "Затвори", {
    //     duration: 8000,
    //     panelClass: ["custom-snackbar"],
    //   });
    // },
    // });
    // this.subscriptions.push(loadHoursSubscription);

    this.timeIntervals = this.selfBookingService.getFreeHours();
  }

  // ============ When API ready need OBJ and have more data to set the next step ============
  public setNexStep(timeInterval) {
    this.nextStep = timeInterval; // will be adjusted
  }
}
