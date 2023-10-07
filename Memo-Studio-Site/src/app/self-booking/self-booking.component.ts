import { Component, ElementRef, HostListener, OnInit } from "@angular/core";

@Component({
  selector: "app-self-booking",
  templateUrl: "./self-booking.component.html",
  styleUrls: ["./self-booking.component.css"],
})
export class SelfBookingComponent implements OnInit {
  date = {
    startValue: null,
    endValue: null,
    rangeDates: [] as Date[],
  };

  timeIntervals: string[] = [];
  numbers: number[] = [];
  scrollContainer: HTMLElement;
  maxNumber = 100;
  pageSize = 10;

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.scrollContainer =
      this.elementRef.nativeElement.querySelector(".scroll-container");
    this.loadNumbers();


    // ============== Will be removed when API is ready! ==============
    const startTime = 8 * 60; // 8:00 in minutes
    const endTime = 17 * 60; // 17:00 in minutes
    const interval = 30; // 30-minute interval

    for (let minutes = startTime; minutes <= endTime; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      this.timeIntervals.push(time);
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.loadNumbers();
  }

  // ============== Will be removed when API is ready! ==============
  loadNumbers() {
    for (
      let i = this.numbers.length;
      i < this.numbers.length + this.pageSize;
      i++
    ) {
      if (i >= this.maxNumber) {
        break;
      }
      this.numbers.push(i + 1);
    }
  }
}
