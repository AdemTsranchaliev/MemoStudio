import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
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
export class UsersListComponent implements OnInit {
  @ViewChild('mobilePaginator') mobilePaginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public users: User[] = [];
  public filteredUsers: MatTableDataSource<User> = new MatTableDataSource<User>();
  public searchText: string = '';
  public obs: Observable<any>;

  private currentSize: string;
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

        this.filteredUsers = new MatTableDataSource(x);
        this.filteredUsers.paginator = this.mobilePaginator;
        this.obs = this.filteredUsers.connect();

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
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public applyMobileFilter(event: any): void {
    this.searchText = event.target.value.toLowerCase();

    // Filter the data directly from the dataSource
    this.filteredUsers.filter = this.searchText;

    // Reset paginator to first page when applying a filter
    if (this.mobilePaginator) {
      this.mobilePaginator.firstPage();
    }
  }

  public isOdd(index: number): boolean {
    return index % 2 != 0;
  }
}
