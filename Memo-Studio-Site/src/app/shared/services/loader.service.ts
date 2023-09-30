import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingGlobal = new BehaviorSubject<boolean>(false);

  constructor() { }

  showLoader() {
    this.isLoadingGlobal.next(true);
  }

  hideLoader() {
    // this.isLoadingGlobal.next(false);

    timer(1000).subscribe(() => {
      this.isLoadingGlobal.next(false);
    });
  }

  getLoaderState(): Observable<boolean> {
    return this.isLoadingGlobal.asObservable();
  }
}
