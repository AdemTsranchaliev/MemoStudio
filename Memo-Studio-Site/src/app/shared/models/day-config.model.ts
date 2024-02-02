import { Moment } from "moment";

export interface DayConfigurations {
    id: number;
    day: string;
    isOpen: boolean;
    openingTime: Moment;
    closingTime: Moment;
    interval: number;
  }