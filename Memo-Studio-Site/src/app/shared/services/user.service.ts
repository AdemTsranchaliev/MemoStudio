import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserListDto } from "src/app/models/user-list-dto.model";
import { User } from "src/app/models/user.model";
import { BASE_URL_DEV, BASE_URL_PROD } from "../routes";
const httpOptions = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
};

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getAllUsers() {
    return this.http.get<User[]>(
      `${BASE_URL_DEV}/User/getAllUsers`,
      httpOptions
    );
  }

  public getUserList(page: number) {
    return this.http.get<UserListDto[]>(
      `${BASE_URL_DEV}/User/getUsersList/${page}`,
      httpOptions
    );
  }

  public getUser(id: number) {
    return this.http.get<User>(
      `${BASE_URL_DEV}/User/${id}`,
      httpOptions
    );
  }
}
