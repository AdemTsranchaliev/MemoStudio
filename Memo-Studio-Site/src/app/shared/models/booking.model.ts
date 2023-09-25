export interface Booking {
  bookingId: string;               // Booking ID
  id: string;               // Booking ID
  name: string | null;     // Name (nullable)
  phone: string | null;    // Phone (nullable)
  year: number;            // Year
  note: string;            // Note
  month: number;           // Month
  day: number;             // Day
  hour: number;            // Hour
  minutes: number;         // Minutes
  free: boolean;           // Free status
  freeHour: string;        // Free hour
  status: number;          // Status
  timestamp: string;       // Timestamp
  createdOn: string;       // CreatedOn
  canceled: boolean;       // Canceled
  email: string | null;    // Email (nullable)
  confirmed: boolean;      // Confirmed
  registeredUser: boolean; // Registered User
  duration: number;        // Duration
}
