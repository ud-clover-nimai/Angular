import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { signup } from 'src/app/beans/signup';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PersonalDetailsService {

  constructor(public httpClient: HttpClient) { }


  public getPersonalDetails(userID:string):Observable<signup>{
    return this.httpClient.get<signup>(`${environment.domain}/nimaiUCM/UserDetails/viewPersonalDetails/`+userID,{headers:{'content-type':'application/json'}});
  }

  public updatePersonalDetails(signup:signup, userID:string):Observable<signup>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserDetails/updatePersonalDetails`,signup,{headers:{'content-type':'application/json'}})
  }

  public getSubUserList(userID:any):Observable<any>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserBranch/subUserList`,userID,{headers:{'content-type':'application/json'}});
  }
  
  public getAddUserList(userID:any):Observable<any>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserBranch/addUserList`,userID,{headers:{'content-type':'application/json'}});
  }

  public getbranchUserList(userID:any):Observable<any>{
    return this.httpClient.post<signup>(`${environment.domain}/nimaiUCM/UserBranch/branchUserList`,userID,{headers:{'content-type':'application/json'}});
  }
}
