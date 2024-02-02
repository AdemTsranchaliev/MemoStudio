// bulgarian-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/bg';

@Pipe({
  name: 'bulgarianDate'
})
export class BulgarianDatePipe implements PipeTransform {
  transform(value: Date | moment.Moment, format: string = 'MMMM'): string {
    moment.locale('bg');
    const formattedDate = moment(value).format(format);
    moment.locale('en'); // Switch back to the default locale after formatting
    return formattedDate;
  }
} 