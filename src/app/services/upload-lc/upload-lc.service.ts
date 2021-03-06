import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LcDetail } from 'src/app/beans/LCDetails';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadLcService {

  constructor(public httpClient:HttpClient) { }

  public saveLc(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/saveLCToDraft`, body,{headers:{'content-type':'application/json'}});
  }

  public confirmLc(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/confirmLC`, body,{headers:{'content-type':'application/json'}})
  }
  public checkDuplicateLC(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/checkDuplicateLC`, body,{headers:{'content-type':'application/json'}})
  }
  public getPortByCountry(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/getPortByCountry`, body,{headers:{'content-type':'application/json'}})
  }
  
  public updateLc(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/updateLCDraft`, body,{headers:{'content-type':'application/json'}})
  }

  public getCustDraftTransaction(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/getDraftTransactionByUserId`,data, { headers: { 'content-type': 'application/json' } });
  }

  public getBankDraftQuotation(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/getDraftQuotationByBankUserId`,data, { headers: { 'content-type': 'application/json' } });
  }

  public checkAcceptedExpiredTransaction(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/checkAcceptedExpiredTransaction`,data, { headers: { 'content-type': 'application/json' } });
  }
  
  public getCustDraftTransactionDelete(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/deleteDraftTransactionByTxnId`, body,{headers:{'content-type':'application/json'}})
  }
  public deleteDraftQuotationByQuotationId(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/deleteDraftQuotationByQuotationId`, body,{headers:{'content-type':'application/json'}})
  }
   

  public getCustspecificDraftTransaction(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/getSpecificDraftTxnDetailByTxnId`,data, { headers: { 'content-type': 'application/json' } });
  }

  public getBankCountForCountry(data:any): Observable<any> {
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/getBankCountForCountry`,data, { headers: { 'content-type': 'application/json' } });
  }

  public confirmLcMailSent(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiEmail/sendTransactionStatus`, body,{headers:{'content-type':'application/json'}})
  }

  public custCloneTransaction(data): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/cloneLC`, data , { headers: { 'content-types': 'application/json' } });
  }

  public confirmLcMailSentToBank(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiEmail/getEligibleEmails`, body,{headers:{'content-type':'application/json'}})
  }

  public checkLcCount(body:any):Observable<any>{
    return this.httpClient.post(`${environment.domain}/nimaiTransaction/checkLCCount`, body,{headers:{'content-type':'application/json'}})
  }
}
