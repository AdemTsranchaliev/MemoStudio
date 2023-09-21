import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { BASE_URL_DEV, BASE_URL_PROD } from "../routes";

@Injectable({
  providedIn: "root",
})
export class AuthenticatinService {
  user: null | undefined = undefined;

  get isUserLogged(): string {
    return localStorage.getItem("AuthToken");
  }

  constructor(private http: HttpClient) {}

  configureOptions() {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
    });

    const token = this.isUserLogged;

    if (token != null) {
      // Check token parse for SERVER
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
    return this.http
      .post(`${BASE_URL_DEV}/logout`, {}, this.configureOptions())
      .pipe(
        tap((user) => {
          this.user = null;
          localStorage.removeItem("username");
          localStorage.removeItem("userId");
          localStorage.removeItem("AuthToken");
        })
      );
  }
}
