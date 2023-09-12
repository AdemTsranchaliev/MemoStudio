import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.css']
})
export class SelectionListComponent {
  @Input() title: string = '';
  @Input() dataSource: any[] = [];
}
