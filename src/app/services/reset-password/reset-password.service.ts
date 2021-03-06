import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Email } from 'src/app/beans/Email';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(public httpClient:HttpClient) { }


  public sendRegistrationEmail(email:Email):Observable<Email>{
   return  this.httpClient.post<Email>(`${environment.domain}/nimaiEmail/sendSetPasswordLink`,email,{headers:{'content-type':'application/json'}});
  }

  public validateToken(token:string):Observable<any>{
   return this.httpClient.get(`${environment.domain}/nimaiEmail/validatePasswordLink/`+token,{headers:{'content-type':'application/json'}});
  }


}
