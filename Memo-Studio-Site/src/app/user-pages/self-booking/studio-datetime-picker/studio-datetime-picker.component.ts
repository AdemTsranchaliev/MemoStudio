import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  LOCALE_ID,
  Inject,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import SwiperCore, { Navigation, Pagination, Swiper } from "swiper";
import { SelfBookingService } from "../../../shared/services/selfBooking.service";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
SwiperCore.use([Navigation, Pagination]);

export class DateModel {
  public date: Date;
  public DayOfWeek: string;
  public month: string;
  public isDisabled: boolean;
  public isClicked: boolean;
}

@Component({
  selector: "app-studio-datetime-picker",
  templateUrl: "./studio-datetime-picker.component.html",
  styleUrls: ["./studio-datetime-picker.component.css"],
})
export class StudioDatetimePickerComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @ViewChild("swiper") swiper: any;
  days: DateModel[] = [];
  // daysOfWeek = ["ПОН", "ВТО", "СРЯ", "ЧЕТ", "ПЕТ", "СЪБ", "НЕД"];
  swiperInstance: any; // Store the Swiper instance
  initialSlideIndex: number = 0;
  selectedDay: DateModel | null = null;

  constructor(
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    private selfBookingService: SelfBookingService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getDates();

    this.disablePastDates();

    // Find and set the current day STYLE!
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const day of this.days) {
      if (this.isCurrentDay(day.date)) {
        this.selectedDay = day;
        break; // Once found, no need to continue searching
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.initialSlideIndex = this.findCurrentDayIndex();
    this.initializeSwiper();
  }

  initializeSwiper(): void {
    this.swiperInstance = new Swiper(this.swiper.nativeElement, {
      slidesPerView: 5,
      spaceBetween: 19,
      initialSlide: this.initialSlideIndex,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      breakpoints: {
        1400: {
          slidesPerView: 5,
        },
        1200: {
          slidesPerView: 5,
        },
        991: {
          slidesPerView: 5,
        },
        770: {
          slidesPerView: 5,
        },
        576: {
          slidesPerView: 3,
        },
        280: {
          slidesPerView: 3,
          initialSlide: this.initialSlideIndex,
        },
      },
    });
  }

  prevSlide(): void {
    if (this.swiperInstance) {
      this.swiperInstance.slidePrev(); // Use swiperInstance to navigate to the previous slide
    }
  }

  nextSlide(): void {
    if (this.swiperInstance) {
      this.swiperInstance.slideNext(); // Use swiperInstance to navigate to the next slide
    }
  }

  getDates(): void {
    // ====== When API ready uncomment! =======
    // const datesSubscription = this.selfBookingService.getDays().subscribe({
    // next: (x) => {
    //   this.days = x;
    // },
    // error: (err) => {
    //   this.snackBar.open(err, "Затвори", {
    //     duration: 8000,
    //     panelClass: ["custom-snackbar"],
    //   });
    // },
    // });
    // this.subscriptions.push(datesSubscription);

    this.days = this.selfBookingService.getDays();
  }

  isCurrentDay(date: Date): boolean {
    const currentDate = new Date();
    return (
      this.datePipe.transform(date, "yyyy-MM-dd") ===
      this.datePipe.transform(currentDate, "yyyy-MM-dd")
    );
  }

  // =========== Not in use now | make next dates/months/years disabled ===========
  isNextMonth(date: Date) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1; // Handle December
    const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;

    // Calculate the first day of the next month
    const firstDayOfNextMonth = new Date(nextYear, nextMonth, 1);

    return date >= firstDayOfNextMonth;
  }

  isPastDate(date: Date): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    return date < currentDate;
  }

  disablePastDates(): void {
    this.days.forEach((day) => {
      day.isDisabled = this.isPastDate(day.date);
    });
  }

  loadFreeHours(day: DateModel) {
    if (!day.isDisabled) {
      if (this.selectedDay) {
        this.selectedDay.isClicked = false; // Remove the style from the previously selected day
      }

      day.isClicked = true; // Apply the style to the clicked day
      this.selectedDay = day; // Update the selected day

      // Add your logic for loading free hours here
      console.log(">>> Load Data for", day.date);
    }
  }

  findCurrentDayIndex(): number {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
    const currentDateFormatted = this.datePipe.transform(
      currentDate,
      "yyyy-MM-dd"
    );

    for (let i = 0; i < this.days.length; i++) {
      const day = this.days[i];
      const dayFormatted = this.datePipe.transform(day.date, "yyyy-MM-dd");

      if (dayFormatted === currentDateFormatted) {
        // console.log('>>>', i);

        return i; // Return the index of the current day
      }
    }

    return 0; // Default to the first day if current day is not found
  }

  // Custom Pipe
  capitalizeFirst(value: string): string {
    if (!value) return value;

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
