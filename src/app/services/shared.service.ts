import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private dataSource = new BehaviorSubject<string>(''); // Initial value
  currentData = this.dataSource.asObservable(); // Expose as Observable

  constructor() {}

  updateData(newData: string) {
    this.dataSource.next(newData);
    console.log('Updated Data:', this.dataSource.getValue()); // ✅ Logs actual value
  }
}
