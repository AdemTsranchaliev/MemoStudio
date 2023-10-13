import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { BASE_URL_DEV, BASE_URL_PROD } from "../routes";
const AUTHTOKEN = 'AUTH_TOKEN';

@Injectable({
  providedIn: "root",
})
export class AuthenticatinService {
  user: null | undefined = undefined;

  constructor(public http: HttpClient) { }

  public isAuthenticated(): boolean {
    return this.getToken() ? true : false;
  }

  public getToken(): string {
    return localStorage.getItem(AUTHTOKEN);
  }

  public setToken(token: string) {
    localStorage.setItem(AUTHTOKEN, token);
  }

  configureOptions() {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
    });
    const token = this.getToken();

    if (token!= null) {
      headers = headers.set("X-Parse-Session-Token", `${token}`);
    }

    const options = { headers };
    return options;
  }

  public login(content) {
    return this.http
      .post(`${BASE_URL_DEV}/authentication`, content, this.configureOptions())
      .pipe(
        tap((token) => {
          // ==== Here we receve token - all user data ====
          // this.user = token;
          // localStorage.setItem('username', content?.username);
          // localStorage.setItem('AuthToken', user?.sessionToken);
          // localStorage.setItem('userId', user?.objectId);
        })
      );
  }

  public forgottenPassword(email) {
    return this.http.post(
      `${BASE_URL_DEV}/account/forgotten-password`,
      email,
      this.configureOptions()
    );
  }

  public register(content) {
    return this.http.post(
      `${BASE_URL_DEV}/account/register`,
      content,
      this.configureOptions()
    );
  }

  public changeForgottenPassword(content) {
    return this.http.post(`${BASE_URL_DEV}/account/change-password`, content);
  }

  public getFacilityId() {
    let token = localStorage.getItem("AUTH_TOKEN");
    const [headerEncoded, payloadEncoded] = token.split(".");
    const payload = JSON.parse(atob(payloadEncoded));

    return payload.FacilityId;
  }

  logout() {
    localStorage.removeItem("AUTH_TOKEN");
  }
}
