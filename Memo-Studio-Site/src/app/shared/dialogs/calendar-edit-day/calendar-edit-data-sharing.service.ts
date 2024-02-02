import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CalendarEditDataSharingService {
    private sharedData = new BehaviorSubject<Moment[]>([]);
    sharedData$ = this.sharedData.asObservable();

    updateData(newData: Moment[]): void {
        this.sharedData.next(newData);
    }
}