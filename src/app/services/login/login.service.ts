import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Login, ChangePassword } from '../../beans/login'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(public httpClient: HttpClient) { }


  public login(login: Login): Observable<Login> {
    return this.httpClient.post<Login>(`${environment.domain}/nimaiUAM/passwordPolicy/signIn`, login, { headers: { 'content-type': 'application/json' } });
  }


  public resetPassword(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiUAM/passwordPolicy/resetPassword`, data, { headers: { 'content-type': 'application/json' } });
  }

  public findUserByToken(token: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiUAM/passwordPolicy/usertoken/` + token, null, { headers: { 'content-type': 'application/json' } })
  }

  public changePassword(data: ChangePassword): Observable<ChangePassword> {
    return this.httpClient.post<ChangePassword>(`${environment.domain}/nimaiUAM/passwordPolicy/changePassword`, data, { headers: { 'content-type': 'application/json' } });
  }

  public getCountryMasterData(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.domain}/nimaiTransaction/getcountryData`, { headers: { 'content-types': 'application/json' } });
  }

}
