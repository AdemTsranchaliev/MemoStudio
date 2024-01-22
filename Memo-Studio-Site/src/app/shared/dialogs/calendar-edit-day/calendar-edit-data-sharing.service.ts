import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CalendarEditDataSharingService {
    private sharedData = new BehaviorSubject<Date[]>([]);
    sharedData$ = this.sharedData.asObservable();

    updateData(newData: Date[]): void {
        this.sharedData.next(newData);
    }
}