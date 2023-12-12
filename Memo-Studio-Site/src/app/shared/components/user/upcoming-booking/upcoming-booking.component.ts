import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CancelBookingComponent } from '../../../dialogs/cancel-booking/cancel-booking.component'

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-upcoming-booking',
  templateUrl: './upcoming-booking.component.html',
  styleUrls: ['./upcoming-booking.component.css']
})
export class UpcomingBookingComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<UserData>;
  displayedColumns: string[] = ['data', 'service', 'business', 'businessProfile', 'actions'];
  date: Date = new Date;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
  ) {
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onBookingCancel() {
    const dialogRef = this.dialog.open(CancelBookingComponent, {
      width: "100vw",
      data: {}
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        dialogRef.updateSize("90%");
      } else {
        dialogRef.updateSize("50%");
      }
    });
    this.subscriptions.push(smallDialogSubscription);

    dialogRef.afterClosed().subscribe((result) => { });
  }

  navigate(param: string) {
    this.router.navigate([`/${param}`]);
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}