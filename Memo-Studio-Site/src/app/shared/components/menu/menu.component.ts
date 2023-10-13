import { Component, OnInit } from '@angular/core';
import { AuthenticatinService } from '../../services/authenticatin.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public authService: AuthenticatinService) { }

  ngOnInit(): void {
  }

}
