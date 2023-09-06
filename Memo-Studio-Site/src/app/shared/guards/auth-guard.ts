import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    var authVert = localStorage.getItem("AUTH_TOKEN");
    var isAuthenticated = authVert ?? null;

    if (isAuthenticated) {
      return true; // Allow access to the route
    } else {
      // Redirect to a login page or any other route
      this.router.navigate(["/login"]);
      return false; // Deny access to the route
    }
  }
}
