import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TransactionBean } from 'src/app/beans/TransactionBean';
import { PlaceQuote, editViewQuotation } from 'src/app/beans/BankNewTransaction';

@Injectable({
  providedIn: 'root'
})
export class NewTransactionService {


  constructor(public httpClient: HttpClient) { }

  public getAllNewTransaction(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllTxnByUserIdAndStatus`,data, { headers: { 'content-types': 'application/json' } });
  }


  public getTransactionDetailByUserId(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getTransactionDetailByUserId`, data, { headers: { 'content-types': 'application/json' } })
  }

  
  public getTransQuotationDtlByBankUserIdAndStatus(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getTransQuotationDtlByBankUserIdAndStatus`, data, { headers: { 'content-types': 'application/json' } })
  }
  
  public saveQuotationToDraft(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/saveQuotationToDraft`, data, { headers: { 'content-types': 'application/json' } })
  }

  public updateCustomerTransaction(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/updateMasterLC`, data, { headers: { 'content-types': 'application/json' } });
  }

  public updateBankTransaction(data: editViewQuotation): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/updateMasterQuotation`, data, { headers: { 'content-types': 'application/json' } });
  }
  
  public confirmQuotation(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiTransaction/confirmQuotation`, data, { headers: { 'content-types': 'application/json' } });
  }

  public getAllNewBankRequest(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllNewRequestsForBank`,data , { headers: { 'content-types': 'application/json' } });
  }

  
  public getBankplaceQuotation(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/saveQuotationToDraft`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getBankgetQuotationCount(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getQuotationCount`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getAllQuotationDetails(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getAllQRByUserIdTxnId`,data , { headers: { 'content-types': 'application/json' } });
  }

  public getQuotationDetails(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/getQuotationDtlByQId`,data , { headers: { 'content-types': 'application/json' } });
  }

  public acceptBankQuote(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/acceptQuote`,data , { headers: { 'content-types': 'application/json' } });
  }

  public custRejectBankQuote(data, quoteId): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/rejectQuote/`+ quoteId, data , { headers: { 'content-types': 'application/json' } });
  }

  public custCloneTransaction(data): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/cloneLC`, data , { headers: { 'content-types': 'application/json' } });
  }

  public custReopenTransaction(data): Observable<any[]> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/reopenTransactionByTxnIdUserId`, data , { headers: { 'content-types': 'application/json' } });
  }

}
