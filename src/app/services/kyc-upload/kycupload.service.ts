import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class KycuploadService {

  constructor(private httpClient : HttpClient) { }


  public upload(formData): Observable<HttpEvent<any>>{
   

    const req = new HttpRequest('POST', `${environment.domain}/nimaiKYC/kyc/saveKycDoc`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
  }
  public viewKycDetails(userID: string): Observable<HttpEvent<any>> {
    return this.httpClient.get<HttpEvent<any>>(`${environment.domain}/nimaiKYC/kyc/kycList/` + userID, { headers: { 'content-type': 'application/json' } });
  }
  public viewKycDetailsLatest(userID: string): Observable<HttpEvent<any>> {
    return this.httpClient.get<HttpEvent<any>>(`${environment.domain}/nimaiKYC/kyc/LatestKycList/` + userID, { headers: { 'content-type': 'application/json' } });
  }
}
