import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {



  private dataSource = new BehaviorSubject<string>(''); 
  currentData = this.dataSource.asObservable(); 

  constructor() {}

  updateData(newData: string) {
    this.dataSource.next(newData); 
    console.log(this.currentData)
  }
}
