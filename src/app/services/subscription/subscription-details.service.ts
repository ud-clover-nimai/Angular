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


  public getPlanByUserId(userID: string): Observable<Subscription> {
    return this.httpClient.get<Subscription>(`${environment.domain}/nimaiSPlan/getSPlan/` + userID, { headers: { 'content-type': 'application/json' } })
  }


  public saveSplan(userID: string, plan: Subscription): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/saveUserSubscriptionPlan/` + userID, plan, { headers: { 'content-type': 'application/json' } })
  }

  public viewAdvisory(): Observable<Subscription> {
    return this.httpClient.get<Subscription>(`${environment.domain}/nimaiSPlan/viewAdvisory` , { headers: { 'content-type': 'application/json' } })
  }

  public getTotalCount(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/getCount`, data, { headers: { 'content-type': 'application/json' } })
  }
}
