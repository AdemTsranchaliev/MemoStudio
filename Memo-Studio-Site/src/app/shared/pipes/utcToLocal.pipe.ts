import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone'; // Import moment-timezone

@Pipe({
  name: 'utcToLocal'
})
export class UtcToLocalPipe implements PipeTransform {
  transform(utcDate: Date | moment.Moment, format: string = 'HH:mm'): string {
    const utcMoment = moment.utc(utcDate);
    const sofiaMoment = moment.tz(utcMoment, 'Europe/Sofia'); // 'Europe/Sofia' is the timezone identifier for Sofia
    return sofiaMoment.isValid() ? sofiaMoment.format(format) : '';
  }
}