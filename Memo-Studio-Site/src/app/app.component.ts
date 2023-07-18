import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MemoStudioBooking';
  token = '';

  checkIsUserLogged() {
    this.token = localStorage.getItem('clientId');
    if (Number(this.token) == 1 || Number(this.token) == 2) {
      return true;
    }

    return false;
  }

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
