import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/models/user.model";
import { MatDialog } from "@angular/material/dialog";
import { UserDetailsComponent } from "../../shared/dialogs/user-details/user-details.component";
import { AuthenticatinService } from "../../shared/services/authenticatin.service";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { FacilityService } from "../../shared/services/facility.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private currentSize: string;
  private users: User[] = [];

  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  public columndefs: any[] = [
    "name",
    "phone",
    "email",
    "operation",
  ];
  public dataSource: MatTableDataSource<User>;
  public subscribedUsers: any[] = [];

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private facilityService: FacilityService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.facilityService.getFacilityUsers().subscribe((x) => {
      this.subscribedUsers = x;
    });

    this.userService.getAllUsers().subscribe({
      next: (x) => {
        this.users = x;

        this.dataSource = new MatTableDataSource(x);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.snackBar.open(err, "Затвори", {
          duration: 8000,
          panelClass: ["custom-snackbar"],
        });
      },
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public openDialog(userId: string) {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: "100vw",
      data: userId,
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        dialogRef.updateSize("100%");
      } else {
        dialogRef.updateSize("100%");
      }
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public isOdd(index: number): boolean {
    return index % 2 != 0;
  }
}
