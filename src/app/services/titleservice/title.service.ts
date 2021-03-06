import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  public titleSource = new BehaviorSubject('NIMAI');
  titleMessage = this.titleSource.asObservable();
  public userSource = new BehaviorSubject('');
  userMessage = this.userSource.asObservable();
  public loading = new BehaviorSubject(false);
  loader = this.loading.asObservable();
  public quote = new BehaviorSubject(false);
  isQuote = this.quote.asObservable();

  constructor() { }

  changeTitle(title: string) {
    this.titleSource.next(title);
  }

  changeUserName(username:string){
    this.userSource.next(username);
  }
}
