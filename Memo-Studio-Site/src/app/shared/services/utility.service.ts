import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  constructor(private http: HttpClient) {}

  public HasError(formGroup: FormGroup, field: string, error: string) {
    return formGroup.get(field).hasError(error);
  }

  public IsTouched(formGroup: FormGroup, field: string) {
    return formGroup.get(field).touched;
  }
}
