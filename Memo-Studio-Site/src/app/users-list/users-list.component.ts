import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UserService } from "../shared/services/user.service";
import { User } from "../shared/models/user.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { UserDetailsComponent } from "../shared/dialogs/user-details/user-details.component";
import { AuthenticatinService } from "../shared/services/authenticatin.service";
import { BreakpointObserver, BreakpointState, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private currentSize: string;
  public isExtraSmall: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.XSmall);

  columndefs: any[] = ["name", "phoneNumber", "operation"];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthenticatinService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.userService
      .getAllUsers()
      .subscribe((x) => {
        // If 404/Error -> show to the user that thre is no data
        this.users = x;

        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  openDialog(userId: string) {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: "100vw",
      data: userId
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe((size) => {
      this.currentSize = size.matches ? "small" : "large";

      if (size.matches) {
        dialogRef.updateSize("100%");
      } else {
        dialogRef.updateSize("50%");
      }
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
