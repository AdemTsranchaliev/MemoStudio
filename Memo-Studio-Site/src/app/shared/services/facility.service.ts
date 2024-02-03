import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL_DEV } from "../routes";
import { FacilitySettingsViewModel } from "../models/facility/facility-setting-model";
import { UpsertServiceCategory } from "../models/facility/upsert-service-category.model";
import { FacilityInformationViewModel } from "../models/facility/facility-information.model";
import { ServiceCategoryResponse, ServiceForUserResponse } from "../models/facility/facility-service.model";
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
export class FacilityService {
  constructor(private http: HttpClient) { }

  public getFacilitySettings() {
    return this.http.get<FacilitySettingsViewModel>(
      `${BASE_URL_DEV}/Facility/facility-settings`
    );
  }

  public getFacilityUsers() {
    return this.http.get<any>(
      `${BASE_URL_DEV}/Facility/facility-users`
    );
  }

  public getFacilityServices() {
    return this.http.get<ServiceCategoryResponse[]>(
      `${BASE_URL_DEV}/Facility/service`
    );
  }

  public getFacilityServicesUser(id:string) {
    return this.http.get<ServiceForUserResponse>(
      `${BASE_URL_DEV}/Facility/service/${id}`
    );
  }

  public updateFacilitySettings(params) {
    return this.http.post(`${BASE_URL_DEV}/Facility/facility-settings`, params);
  }

  public getService() {
    return this.http.get(`${BASE_URL_DEV}/Facility/service`);
  }

  public upsertServiceCategory(params: UpsertServiceCategory) {
    return this.http.post<UpsertServiceCategory>(`${BASE_URL_DEV}/Facility/service-category`, params);
  }

  public removeCategory(categoryId: number){
    return this.http.delete(`${BASE_URL_DEV}/Facility/service-category/${categoryId}`);
  }

  public removeService(serviceId: number){
    return this.http.delete(`${BASE_URL_DEV}/Facility/service/${serviceId}`);
  }

  public getFacilityInformation(facilityId: string){
    return this.http.get<FacilityInformationViewModel>(`${BASE_URL_DEV}/Facility/information/${facilityId}`);
  }
}
