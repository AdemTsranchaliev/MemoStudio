import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UserService } from "../shared/services/user.service";
import { User } from "../shared/models/user.model";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetailsComponent } from "../shared/dialogs/user-details/user-details.component";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columndefs: any[] = ["id", "name", "phoneNumber", "operation"];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let hardCodedID = '7FAD3AE0-1F9E-4607-A40B-71441F026620';
    this.userService.getAllUsers(hardCodedID).subscribe((x) => {
      this.users = x;
      console.log();
      

      this.dataSource = new MatTableDataSource(this.users);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  openDialog() {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '100vw',
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
