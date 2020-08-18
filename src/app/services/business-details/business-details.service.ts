import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business } from 'src/app/beans/business';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BusinessDetailsService {

  constructor(public httpClient: HttpClient) { }


  public viewBusinessDetails(userID: string): Observable<Business> {
    return this.httpClient.get<Business>(`${environment.domain}/nimaiUCM/UserDetails/viewBusinessDetails/` + userID, { headers: { 'content-type': 'application/json' } });
  }


  public updateBusinessDetails(businessData: Business, userID): Observable<Business> {
    return this.httpClient.post<Business>(`${environment.domain}/nimaiUCM/UserDetails/updateBusinessDetails`, businessData, { headers: { 'content-type': 'application/json' } });
  }
}
