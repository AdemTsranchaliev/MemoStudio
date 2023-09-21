import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.css"],
})
export class AuthenticationComponent implements OnInit {
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  selected = new FormControl(0);

  constructor() { }

  ngOnInit(): void { }

  setSelectedTabIndex(index: number) {
    this.tabGroup.selectedIndex = index;
  }
}
