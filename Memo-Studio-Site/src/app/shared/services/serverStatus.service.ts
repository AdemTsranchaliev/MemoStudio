import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { BASE_URL_DEV, BASE_URL_PROD } from "../routes";

@Injectable({
    providedIn: "root",
})
export class ServerStatusService {
    constructor(private http: HttpClient) { }

    checkServerStatus(): Observable<void> {
        const endpoint = `${BASE_URL_DEV}/User/getAllUsers` // Replace with your server's endpoint
        return this.http.get<void>(endpoint).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error("Server is down:", error);
                return throwError("Server is down");
            })
        );
    }
}
