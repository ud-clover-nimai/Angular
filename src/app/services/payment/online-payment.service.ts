import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnlinePaymentService {

  constructor(private httpClient:HttpClient) { }

  public initiatePG(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/initiatePG` , data, { headers: { 'content-type': 'application/json' } })
  }
}
