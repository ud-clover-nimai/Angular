import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class KycuploadService {

  constructor(private httpClient : HttpClient) { }


  public upload(formData:FormData): Observable<HttpEvent<any>>{
   

    const req = new HttpRequest('POST', `${environment.domain}/nimaiKYC/kyc/uploadMultipleFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
  }
}
