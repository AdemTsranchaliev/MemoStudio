import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public name: string;
  public password: string;
  public error: number = null;
  constructor(private http: HttpClient, private routing: Router) {}

  ngOnInit(): void {}

  submit() {
    if (this.name == "memo" && this.password == "_Passw0rd@543") {
      localStorage.setItem("clientId", "1");
      this.routing.navigate(["/booking"]);
    } else if (this.name == "stela" && this.password == "_Passw0rd@543") {
      localStorage.setItem("clientId", "2");
      this.routing.navigate(["/booking"]);
    } else {
      this.error = 1;
    }
  }
}
