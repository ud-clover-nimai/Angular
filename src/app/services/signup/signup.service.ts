import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signup } from 'src/app/beans/signup';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor(public httpClient:HttpClient) { }
  public signUp(sugnup:signup):Observable<signup>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserDetails/registerUser`,
    sugnup,{headers:{'content-type':'application/json'}});
  }
  // public userBranch(Data): Observable<any> {
  //   return this.httpClient.post<any>(`${environment.domain}/nimaiUCM/UserBranch/userBranch/BC1511`, Data, { headers: { 'content-type': 'application/json' } });
  // }
  public userBranch(Data,userID:string): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiUCM/UserBranch/userBranch/`+userID, Data, { headers: { 'content-type': 'application/json' } });
  }
  public getSubsidiaryList(userID:string): Observable<any> {
    return this.httpClient.get<any>(`${environment.domain}/nimaiUCM/UserDetails/getSubsidiaryList/`+userID, { headers: { 'content-type': 'application/json' } });
  }
}
