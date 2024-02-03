export interface ServiceCategoryResponse {
    id: number;
    name: string;
    facilityId: number;
    services: ServiceResponse[];
  }
  
  export interface ServiceResponse {
    id: number;
    name: string;
    price?: number | null;
    description?: string | null;
    duration: number;
    facilityId: number;
    serviceCategoryId: number;
  }

  export interface ServiceForUserResponse {
    name: string;
    imageBase64: string;
    services: ServiceCategoryResponse[];
  }