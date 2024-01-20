import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-side-tab-selection-list",
  templateUrl: "./side-tab-selection-list.component.html",
  styleUrls: ["./side-tab-selection-list.component.css"],
})
export class SideTabSelectionListComponent {
  @Input() activeTab: number = 1;
  @Input() tabs: string[] = [];
  @Output() emitedActiveTabChange: EventEmitter<number> =
    new EventEmitter<number>();

  public changeTab(id: number) {
    this.activeTab = id;
    this.emitedActiveTabChange.emit(this.activeTab);
  }
}
