import { Moment } from "moment";

export interface FacilitySettingsViewModel {
  startPeriod: Moment;
  endPeriod: Moment;
  interval: number;
  workingDaysJson: string;
  allowUserBooking: boolean;
}
