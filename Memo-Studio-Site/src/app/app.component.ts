import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MemoStudioBooking';

  userId = localStorage.getItem('userId');

  public getNameEmployee() {
    if (localStorage.getItem("clientId") == "1") {
      return "Мемо";
    } else {
      return "Стела";
    }
  }

  public logout() {
    localStorage.removeItem("clientId");
    location.reload();
  }
}
