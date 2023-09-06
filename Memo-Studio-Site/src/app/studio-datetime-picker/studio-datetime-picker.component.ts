import { Component, OnInit } from "@angular/core";
export class DateModel {
  public day: string;
  public DayOfWeek: string;
}
@Component({
  selector: "app-studio-datetime-picker",
  templateUrl: "./studio-datetime-picker.component.html",
  styleUrls: ["./studio-datetime-picker.component.css"],
})
export class StudioDatetimePickerComponent implements OnInit {
  days: DateModel[] = [];
  daysOfWeek = ["ПОН", "ВТО", "СРЯ", "ЧЕТ", "ПЕТ", "СЪБ", "НЕД"];
  constructor() {}

  ngOnInit(): void {
    for (let i = 20; i < 26; i++) {
      this.days.push({ day: `${i}`, DayOfWeek: this.daysOfWeek[i % 7] });
    }
  }
}
