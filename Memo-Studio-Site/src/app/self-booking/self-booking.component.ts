import { Component, ElementRef, HostListener, OnInit } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelfBookingModalComponent } from "../shared/self-booking-modal/self-booking-modal.component";

@Component({
  selector: "app-self-booking",
  templateUrl: "./self-booking.component.html",
  styleUrls: ["./self-booking.component.css"],
  animations: [
    trigger("scrollAnimation", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate("500ms ease-in-out", style({ transform: "translateX(0)" })),
      ]),
    ]),
  ],
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
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.scrollContainer =
      this.elementRef.nativeElement.querySelector(".scroll-container");
    this.loadNumbers();

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

  onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (scrollLeft === maxScrollLeft) {
      this.loadNumbers();
    }
  }

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

  openDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '50%',
      // data: currentElement | From data need to pass ID? 
    };

    const dialogRef = this.dialog.open(SelfBookingModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
