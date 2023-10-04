import { Component, OnInit, AfterViewInit, ViewChild, Inject } from "@angular/core";
import { User } from "../../models/user.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UserService } from "../../../shared/services/user.service";
import { Subscription } from "rxjs";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

interface Reservation {

}

interface Notification {

}

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit, AfterViewInit {
  private subscriptions: Subscription[] = [];

  // Reservations Tab
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort1', { static: true }) sort1: MatSort;

  notifications: Notification[] = [];
  columndefs: any[] = ["sentOn", "type", "status", "service"];
  dataSource: MatTableDataSource<Notification>;

  // Reservations Tab
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2', { static: true }) sort2: MatSort;

  reservationsColumns: string[] = ['reservationData', 'note', 'createdFrom', 'status'];
  reservationsDataSource: MatTableDataSource<Reservation>;
  reservations: Reservation[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public userId: any,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getUsersReservations(this.userId);
  }

  ngAfterViewInit() {
    // Notifications
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator1;
      this.dataSource.sort = this.sort1;
    }
    // Reservations
    if (this.reservationsDataSource) {
      this.reservationsDataSource.paginator = this.paginator2;
      this.reservationsDataSource.sort = this.sort2;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  reservationsStatusColor(row: any): string {
    const timestampFromDatabase = new Date(row.timestamp);
    const currentDate = new Date();
    let status = '';

    // Compare the current date with the timestamp date (ignoring minutes and seconds)
    if (currentDate > timestampFromDatabase) {
      status = 'isDone';
    } else {
      // The current date is earlier than the timestamp date and hour
      status = 'isComming';
    }

    if (row.isCanceled) {
      status = 'isCanceled';
    }

    switch (status) {
      case 'isComming':
        return 'blue';
      case 'isDone':
        return 'purple';
      case 'isCanceled':
        return 'red';
      default:
        return '';
    }
  }

  reservationsStatusName(row: any): string {
    const timestampFromDatabase = new Date(row.timestamp);
    const currentDate = new Date();
    let status = '';

    // Compare the current date with the timestamp date (ignoring minutes and seconds)
    if (currentDate > timestampFromDatabase) {
      status = 'isDone';
    } else {
      // The current date is earlier than the timestamp date and hour
      status = 'isComming';
    }

    if (row.isCanceled) {
      status = 'isCanceled';
    }

    switch (status) {
      case 'isComming':
        return 'Предстои';
      case 'isDone':
        return 'Изпълнен';
      case 'isCanceled':
        return 'Отказан';
      default:
        return '';
    }
  }

  notificationStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'notification-sent';
      case 2:
        return 'purple';
      case 3:
        return 'blue';
      default:
        return '';
    }
  }

  notificationStatusName(status: number): string {
    switch (status) {
      case 1:
        return 'Изпратено';
      case 2:
        return 'Получено';
      case 3:
        return 'Видяно';
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

    if (tabIndex === 1) {
      this.getUsersNotifications(this.userId);
    }
  }

  getUsersReservations(userId: string) {
    const reservationsSubscription = this.userService.getUserReservations(userId).subscribe((x) => {
      this.reservationsDataSource = new MatTableDataSource(x);
      this.reservations = x;
    });
    this.subscriptions.push(reservationsSubscription);
  }

  getUsersNotifications(userId: string) {
    const notificationsSubscription = this.userService.getUserNotifications(userId).subscribe((x) => {
      this.dataSource = new MatTableDataSource(x);
      this.notifications = x;
    });
    this.subscriptions.push(notificationsSubscription);
  }
}
