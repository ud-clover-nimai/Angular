import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { signup } from 'src/app/beans/signup';

@Injectable({
  providedIn: 'root'
})
export class ReferService {

  constructor(public httpClient: HttpClient) { }


  public addRefer(data):Observable<signup>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/saverefer`,data,{headers:{'content-type':'application/json'}})
  }

  public viewRefer(userID:string):Observable<signup>{
    return this.httpClient.get<signup>(`${environment.domain}/nimaiUCM/getReferListByUserId/`+userID,{headers:{'content-type':'application/json'}});
  }
  
  public getRegisterUsers(userID:string):Observable<signup>{
    return this.httpClient.get<signup>(`${environment.domain}/nimaiUCM/getRegisterUsers/`+userID,{headers:{'content-type':'application/json'}});
  }
  public getRegisterUserByUserId(userID:string):Observable<signup>{
    return this.httpClient.get<signup>(`${environment.domain}/nimaiUCM/getRegisterUserByUserId/`+userID,{headers:{'content-type':'application/json'}});
  }
}
