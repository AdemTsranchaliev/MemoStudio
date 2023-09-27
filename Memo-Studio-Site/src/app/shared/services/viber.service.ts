import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "src/app/shared/models/user.model";
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
export class ViberService {
    constructor(private http: HttpClient) { }

    public getViberData() {
        return this.http.get(
            `${BASE_URL_DEV}/Viber/getData`,
            httpOptions
        );
    }

    public postViberData() {
        return this.http.post(
            `${BASE_URL_DEV}/Viber/postData`,
            httpOptions
        );
    }

    public getViberConfirmationCode() {
        return this.http.get(
            `${BASE_URL_DEV}/Viber/confirmation-code`,
            httpOptions
        );
    }
}