import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public activeTab: number = 1;
  constructor() { }

  ngOnInit(): void {
  }

  public changeTab(id: number){

    this.activeTab = id;
  }

}
