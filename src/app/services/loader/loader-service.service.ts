import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderServiceService {

  public isLoading = new BehaviorSubject(false);
  constructor() { }
}
