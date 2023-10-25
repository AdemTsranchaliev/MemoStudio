import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticatinService } from "../services/authenticatin.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticatinService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true; // Allow access to the route
    } else {
      // Redirect to a login page or any other route
      this.router.navigate(["/login"]);
      return false; // Deny access to the route
    }
  }
}
