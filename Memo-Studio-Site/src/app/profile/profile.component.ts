import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public activeTab: number = 1;
  public pageTabs: string[] = ['Основни', 'Защита', 'Календар', 'Известия'];

  constructor() { }

  ngOnInit(): void {
  }

  handleActiveTabChange(newActiveTab: number) {
    this.activeTab = newActiveTab;
  }
}
