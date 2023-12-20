import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { AccountViewModel } from "../shared/models/account/account.model";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent {
  public activeTab: number = 1;
  public pageTabs: string[] = ['Основни', 'Смяна на парола', 'Известия', 'Услуги', 'Календар'];

  handleActiveTabChange(newActiveTab: number) {
    this.activeTab = newActiveTab;
  }
}
