import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL_DEV } from "../routes";
import { AccountViewModel } from "../models/account/account.model";
import { CalendarProfileInformation } from "../models/account/calendar-profile-information.model";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  constructor(private http: HttpClient) { }

  public updateProfilePicture(base64Content: string) {
    return this.http.post(`${BASE_URL_DEV}/account/profile-picture`, { base64Content: base64Content });
  }

  public getUserInformation() {
    return this.http.get<AccountViewModel>(`${BASE_URL_DEV}/account/information`);
  }

  public updateUserInformation(content: AccountViewModel) {
    return this.http.post<AccountViewModel>(`${BASE_URL_DEV}/account/information`, content);
  }

  public getCalendarUserInformation() {
    return this.http.get<CalendarProfileInformation>(`${BASE_URL_DEV}/account/calendar-profile-information`);
  }
}
