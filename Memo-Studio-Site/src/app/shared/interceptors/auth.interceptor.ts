import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticatinService } from "../services/authenticatin.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticatinService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.authService.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      });
    }

    return next.handle(request);
  }
}
