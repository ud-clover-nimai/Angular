import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LcDetail } from 'src/app/beans/LCDetails';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardDetailsService {
  constructor(public httpClient:HttpClient) { }
  public getCreditAndTransactionList(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/getCreditTxnForCustomerByUserId`,data, { headers: { 'content-type': 'application/json' } });
  }
  
  public getCreditTxnForCustomerByBankUserId(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/getCreditTxnForCustomerByBankUserId`,data, { headers: { 'content-type': 'application/json' } });
  }
  public getUserList(userID:string): Observable<any> {
    return this.httpClient.get<any>(`${environment.domain}/nimaiUCM/UserDetails/getAdditionalUserList/`+userID, { headers: { 'content-type': 'application/json' } });
  }


  public getCustomerDashboardDetails(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/customerDashboard`,data, { headers: { 'content-type': 'application/json' } });
  }
  public getBankDashboardDetails(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/bankDashboard`,data, { headers: { 'content-type': 'application/json' } });
  }
  public getReferrerDashboardDetails(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/referDashboard`,data, { headers: { 'content-type': 'application/json' } });
  }
  public viewCountryList(): Observable<any> {
    return this.httpClient.get<any>(`${environment.domain}/nimaiUCM/UserDetails/viewDetailedCountry` , { headers: { 'content-type': 'application/json' } });
  } 
  public custCloseTransaction(data): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/closeTransaction`, data , { headers: { 'content-types': 'application/json' } });
  }
}
