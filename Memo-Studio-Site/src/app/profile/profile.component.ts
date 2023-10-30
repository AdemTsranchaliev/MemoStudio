import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AccountService } from '../shared/services/account.service';
import { AccountViewModel } from './general/general.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewChecked {
  public activeTab: number = 1;
  public pageTabs: string[] = ['Основни', 'Защита', 'Календар', 'Известия'];
  public showPage: boolean = false;
  user: AccountViewModel;

  constructor(
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.accountService.getUserInformation().subscribe((res) => {
      this.user = res;
    });
  }

  handleActiveTabChange(newActiveTab: number) {
    this.activeTab = newActiveTab;
  }

  ngAfterViewChecked(): void {
    this.showPage = true;
  }
}
