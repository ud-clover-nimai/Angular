import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'src/app/beans/subscription';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionDetailsService {

  constructor(private httpClient: HttpClient) { }

  getSubscriptionDetails(): Observable<any> {
    return this.httpClient.get(`${environment.domain}/nimaiSPlan/getSPlans`,
      { headers: { 'content-type': 'application/json' } });
  }

  getPlansByCountry(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/viewCustomerSPlan` , data, { headers: { 'content-type': 'application/json' } })
  }


  public getPlanByUserId(userID: string): Observable<Subscription> {
    return this.httpClient.get<Subscription>(`${environment.domain}/nimaiSPlan/getSPlan/` + userID, { headers: { 'content-type': 'application/json' } })
  }


  public saveSplan(userID: string, plan: Subscription): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/saveUserSubscriptionPlan/` + userID, plan,{ headers: { 'content-type': 'application/json' } })
  }
  public addVas(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/addVAS`, data,{ headers: { 'content-type': 'application/json' } })
  }
  public applyCoupon(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/applyCoupon`, data,{ headers: { 'content-type': 'application/json' } })
  }
  public removeCoupon(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/removeCoupon`, data,{ headers: { 'content-type': 'application/json' } })
  }
  public sendAccDetails(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiEmail/sendAccDetails`, data,{ headers: { 'content-type': 'application/json' } })
  }
  public viewAdvisory(data,userID): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/getAdvisoryListByCountry/`+ userID ,data, { headers: { 'content-type': 'application/json' } })
  }
  public getVASByUserId(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/getVASByUserId` ,data, { headers: { 'content-type': 'application/json' } })
  }
  public getTotalCount(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/getCount`, data, { headers: { 'content-type': 'application/json' } })
  }

  public getUserStats(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.domain}/nimaiUAM/passwordPolicy/getLiveUserStats`, { headers: { 'content-types': 'application/json' } });
  }
  public getSubscriptionList(): Observable<any[]> {
   // console.log("In service")
    return this.httpClient.get<any[]>(`${environment.domain}/nimaiSPlan/viewAllCustomerSPlan` , { headers: { 'content-type': 'application/json' } });
  }

}
