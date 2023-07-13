import { Component, OnInit } from "@angular/core";
import { UserListDto } from "../models/user-list-dto.model";
import { UserService } from "../shared/services/user.service";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  constructor(private userService: UserService) {}

  users: UserListDto[] = [];
  ngOnInit(): void {

    this.userService.getUserList(1).subscribe(x=>{
      this.users = x;
    })

  }
}
