import { Component, OnInit } from "@angular/core";
import { AuthenticatinService } from "../../services/authenticatin.service";

@Component({
  selector: "app-nav-qr-code",
  templateUrl: "./nav-qr-code.component.html",
  styleUrls: ["./nav-qr-code.component.css"],
})
export class NavQrCodeComponent implements OnInit {
  public facilityLink: string;

  constructor(private authService: AuthenticatinService) {}

  ngOnInit(): void {
    this.facilityLink = `https://localhost:4200/#/facility-schedule/${this.authService.getFacilityId()}`;
  }
}
