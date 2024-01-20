import { Component, Input, OnInit } from "@angular/core";
import { FormArray } from "@angular/forms";

@Component({
  selector: "app-selection-list",
  templateUrl: "./selection-list.component.html",
  styleUrls: ["./selection-list.component.css"],
})
export class SelectionListComponent implements OnInit {
  @Input() workingDays: FormArray;

  public dayOfWeeks: string[] = [
    "Понеделник",
    "Вторник",
    "Сряда",
    "Четвъртък",
    "Петък",
    "Събота",
    "Неделя",
  ];

  ngOnInit(): void {
    this.workingDays?.valueChanges.subscribe(() => {
      console.log(this.workingDays);
    });
  }

  public toggleWorkingDay(index: number) {
    const existingControl = this.workingDays.at(index);
    const isOpen = existingControl.get("isOpen").value;
    existingControl.get("isOpen").setValue(!isOpen);
  }
}
