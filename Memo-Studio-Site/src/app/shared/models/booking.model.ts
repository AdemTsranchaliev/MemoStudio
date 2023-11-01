export interface Booking {
  id:number;
  bookingId: string;
  timestamp: Date;
  createdOn: Date;
  canceled: boolean;
  note?: string;
  name?: string;
  email?: string;
  phone?: string;
  confirmed: boolean;
  registeredUser: boolean;
  duration: number;
}

