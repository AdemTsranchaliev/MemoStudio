import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { User } from "../../models/user.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit, AfterViewInit {
  // Reservations Tab
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort1', { static: true }) sort1: MatSort;

  notifications: Notification[] = [];
  columndefs: any[] = ["sentOn", "type", "status", "service"];
  dataSource: MatTableDataSource<Notification>;

  // Reservations Tab
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2', { static: true }) sort2: MatSort;

  reservationsColumns: string[] = ['reservationData', 'createdFrom', 'status'];
  reservationsDataSource: MatTableDataSource<Reservation>;
  reservations: Reservation[] = [];

  constructor() { }

  ngOnInit(): void {
    this.notifications = [
      new Notification(new Date(1), "Email", "Изпратено", "Подстрижка"),
      new Notification(new Date(2), "Viber", "Получено", "Среща"),
      new Notification(new Date(3), "Viber", "Видяно", "Среща"),
    ];

    this.reservations = [
      new Reservation(new Date(2012, 1, 29), 'Администратор', 'В Ход'),
      new Reservation(new Date(2012, 2, 9), 'Иван Иванов', 'Изпълнен'),
      new Reservation(new Date(2012, 2, 10), 'Администратор', 'Отказан'),
      new Reservation(new Date(2012, 2, 12), 'Иван Иванов', 'Предстои'),
      new Reservation(new Date(2012, 2, 14), 'Администратор', 'Потвърден'),
    ];

    this.dataSource = new MatTableDataSource(this.notifications);
    this.reservationsDataSource = new MatTableDataSource(this.reservations);
  }

  ngAfterViewInit() {
    // Notifications
    this.dataSource.paginator = this.paginator1;
    this.dataSource.sort = this.sort1;
    // Reservations
    this.reservationsDataSource.paginator = this.paginator2;
    this.reservationsDataSource.sort = this.sort2;
  }

  reservationsStatusColor(status: string): string {
    switch (status) {
      case 'Предстои':
        return 'blue';
      case 'Потвърден':
        return 'green';
      case 'В Ход':
        return 'orange';
      case 'Отказан':
        return 'red';
      case 'Изпълнен':
        return 'purple';
      default:
        return '';
    }
  }

  notificationStatusColor(status: string): string {
    switch (status) {
      case 'Изпратено':
        return 'notification-sent';
      case 'Получено':
        return 'purple';
      case 'Видяно':
        return 'blue';
      default:
        return '';
    }
  }

  _setDataSource(tabIndex: any) {
    setTimeout(() => {
      switch (tabIndex) {
        case 0:
          !this.reservationsDataSource.sort ? this.reservationsDataSource.sort = this.sort1 : null;
          !this.dataSource.paginator ? this.dataSource.paginator = this.paginator1 : null;
          break;
        case 1:
          !this.reservationsDataSource.sort ? this.reservationsDataSource.sort = this.sort2 : null;
          !this.reservationsDataSource.paginator ? this.reservationsDataSource.paginator = this.paginator2 : null;
          break;
      }
    });
  }
}

export class Notification {
  constructor(sentOn: Date, type: string, status: string, service: string) {
    this.sentOn = sentOn;
    this.type = type;
    this.status = status;
    this.service = service;
  }
  public sentOn: Date;
  public type: string;
  public status: string;
  public service: string;
}

export class Reservation {
  constructor(reservationData: Date, createdFrom: string, status: string) {
    this.reservationData = reservationData;
    this.createdFrom = createdFrom;
    this.status = status;
  }
  public reservationData: Date;
  public createdFrom: string;
  public status: string;
}
