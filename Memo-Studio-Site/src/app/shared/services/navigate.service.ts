import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class NavigateService {
    constructor(private router: Router) { }

    navigate(param: string) {
        this.router.navigate([`/${param}`]);
    }
}
