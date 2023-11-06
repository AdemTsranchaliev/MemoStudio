import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class ReservationCalendarComponent implements OnInit {

  public isDayPast: boolean = false;
  public isServerDown: boolean = false;
  public loader: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  editDay(){}

}
