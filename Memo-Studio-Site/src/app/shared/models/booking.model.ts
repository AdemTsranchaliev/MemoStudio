export class Booking {
  id: number;
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
  isFree: boolean;

  constructor(
    id: number = -1,
    bookingId: string = "",
    timestamp: Date = new Date(),
    createdOn: Date = new Date(),
    canceled: boolean = false,
    note?: string,
    name?: string,
    email?: string,
    phone?: string,
    confirmed: boolean = false,
    registeredUser: boolean = false,
    duration: number = 0
  ) {
    this.id = id;
    this.bookingId = bookingId;
    this.timestamp = timestamp;
    this.createdOn = createdOn;
    this.canceled = canceled;
    this.note = note;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.confirmed = confirmed;
    this.registeredUser = registeredUser;
    this.duration = duration;
  }
}

export interface BookingsList{
  isOpen: boolean;
  bookings: Booking[];
}
