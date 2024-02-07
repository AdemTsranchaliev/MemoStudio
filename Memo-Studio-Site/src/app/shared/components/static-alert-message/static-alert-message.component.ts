import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-static-alert-message',
  templateUrl: './static-alert-message.component.html',
  styleUrls: ['./static-alert-message.component.css']
})
export class StaticAlertMessageComponent {
  @Input() alertMessage: string;
  @Input() alertStyle: string;

  constructor() { }
}
