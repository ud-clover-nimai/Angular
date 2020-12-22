import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { onlinePaymentDltString } from 'src/app/beans/payment';
import { OnlinePaymentService } from 'src/app/services/payment/online-payment.service';

@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.css']
})
export class OnlinePaymentComponent implements OnInit {
  hiddenfields: boolean=false;
  public data: onlinePaymentDltString;
  detail: any;
  srcUrl: string;
    

  constructor(private onlinePayment:OnlinePaymentService) {
this.data={

  merchantId:"",
  orderId:"",
  currency:"",
  amount:"",
  redirectURL:"",
  cancelURL:"",
  language:"",
  billingName:"",
  billingAddress:"",
  billingCity:"",
  billingState:"",
  billingZip:"",
  billingCountry:"",
  billingTel:"",
  billingEmail:"",
  shippingName:"",
  shippingAddress:"",
  shippingCity:"",
  shippingState:"",
  shippingZip:"",
  shippingCountry:"",
  shippingTel:"",
  merchantParam1:"",
  merchantParam2:"",
  merchantParam3:"",
  merchantParam4:"",
  merchantParam5:"",
  integrationType:"",
  promoCode:"",
  customerIdentifier:""

}

   }
   

  ngOnInit() {
    this.hiddenfields=true;
  }


  submit(){
    const onlinePay={
      "userId":sessionStorage.getItem('userID'),
      "merchantId":"45990",
      "orderId":"",
      "amount":"4",
      "currency":"USD",
      "redirectURL":"http://136.232.244.190:8081/nimaiSPlan/PGResponse",
      "cancelURL":"http://136.232.244.190:8081/nimaiSPlan/PGResponse"
    }

    this.onlinePayment.initiatePG(onlinePay).subscribe((response)=>{
      this.detail = JSON.parse(JSON.stringify(response)).data;
      this.srcUrl= "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction&merchant_id="+this.detail.merchantId+"&encRequest="+this.detail.requestDump+"&access_code="+this.detail.accessCode+"&embedded=true"
  console.log(this.srcUrl)
  //document.location.href = this.srcUrl;
    } ) }

  }
