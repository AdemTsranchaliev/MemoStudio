import { Component, OnInit, AfterViewInit, ViewChild, LOCALE_ID, Inject } from "@angular/core";
import { DatePipe } from '@angular/common';
import SwiperCore, { Navigation, Pagination, Swiper } from "swiper";
SwiperCore.use([Navigation, Pagination]);

export class DateModel {
  public date: Date;
  public DayOfWeek: string;
  public month: string;
  public isDisabled: boolean;
}

@Component({
  selector: "app-studio-datetime-picker",
  templateUrl: "./studio-datetime-picker.component.html",
  styleUrls: ["./studio-datetime-picker.component.css"],
})
export class StudioDatetimePickerComponent implements OnInit, AfterViewInit {
  @ViewChild("swiper") swiper: any;
  days: DateModel[] = [];
  daysOfWeek = ["ПОН", "ВТО", "СРЯ", "ЧЕТ", "ПЕТ", "СЪБ", "НЕД"];
  swiperInstance: any; // Store the Swiper instance
  initialSlideIndex: number = 0;

  constructor(
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    this.generateDates(); // Call a function to generate date objects
    this.disablePastDates();
  }

  ngAfterViewInit(): void {
    this.initialSlideIndex = this.findCurrentDayIndex();
    this.initializeSwiper();
  }

  initializeSwiper(): void {
    this.swiperInstance = new Swiper(this.swiper.nativeElement, {
      slidesPerView: 7,
      spaceBetween: 18,
      initialSlide: this.initialSlideIndex,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      breakpoints: {
        1400: {
          slidesPerView: 7,
        },
        1200: {
          slidesPerView: 7,
        },
        991: {
          slidesPerView: 7,
        },
        770: {
          slidesPerView: 7,
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

  generateDates(): void {
    const today = new Date();

    // Define the number of months to generate dates for
    const numMonthsToShow = 3; // You can adjust this as needed

    for (let monthOffset = 0; monthOffset < numMonthsToShow; monthOffset++) {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 0);

      for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
        const monthName = this.datePipe.transform(day, 'LLLL', this.locale);
        this.days.push({
          date: new Date(day),
          DayOfWeek: this.daysOfWeek[day.getDay()],
          month: monthName,
          isDisabled: false,
        });
      }
    }
  }


  isCurrentDay(date: Date): boolean {
    const currentDate = new Date();
    return this.datePipe.transform(date, 'yyyy-MM-dd') === this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }

  // =========== Not in use now | If need to make next dates/months/years disabled ===========
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
    if (day.isDisabled == false) {
      console.log('>>> Load Data');
    }
  }

  findCurrentDayIndex(): number {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
    const currentDateFormatted = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    for (let i = 0; i < this.days.length; i++) {
      const day = this.days[i];
      const dayFormatted = this.datePipe.transform(day.date, 'yyyy-MM-dd');

      if (dayFormatted === currentDateFormatted) {
        // console.log('>>>', i);

        return i; // Return the index of the current day
      }
    }

    return 0; // Default to the first day if current day is not found
  }
}
