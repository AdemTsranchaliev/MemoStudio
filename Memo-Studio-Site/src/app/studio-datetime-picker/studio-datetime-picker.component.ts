import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { DatePipe } from '@angular/common';
import SwiperCore, { Navigation, Swiper } from "swiper";
SwiperCore.use([Navigation]);

export class DateModel {
  public date: Date;
  public DayOfWeek: string;
  isDisabled: boolean;
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


  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.generateDates(); // Call a function to generate date objects
    this.disablePastDates();
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  initializeSwiper(): void {
    this.swiperInstance = new Swiper(this.swiper.nativeElement, {
      slidesPerView: 7,
      spaceBetween: 18,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
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
          slidesPerView: 4,
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
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
      this.days.push({
        date: new Date(day),
        DayOfWeek: this.daysOfWeek[day.getDay()],
        isDisabled: false
      });
    }
  }

  isCurrentDay(date: Date): boolean {
    const currentDate = new Date();
    return this.datePipe.transform(date, 'yyyy-MM-dd') === this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }

  isPastDate(date: Date): boolean {
    const currentDate = new Date();
    return date.getDate() < currentDate.getDate();
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
}
