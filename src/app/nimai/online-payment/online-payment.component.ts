import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { onlinePaymentDltString } from 'src/app/beans/payment';
import { OnlinePaymentService } from 'src/app/services/payment/online-payment.service';
import { onlinePayLoad} from '../../../assets/js/commons'

@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.css']
})
export class OnlinePaymentComponent implements OnInit {
  hiddenfields: boolean=true;
  public data: onlinePaymentDltString;
  detail: any="";
  enableFeild:boolean=false;
  public parentURL: string = "";
  public subURL: string = "";
    
  @ViewChild('form',{static:true}) form: ElementRef;
  pgDetail: any="";

  constructor(private onlinePayment:OnlinePaymentService,  public activatedRoute: ActivatedRoute ) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
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
   // this.hiddenfields=true;
  }


  submit(){   


    const onlinePay={
      "userId":sessionStorage.getItem('userID'),
      "merchantId":"45990",
      "orderId":"",
      "amount":"4",
      "currency":"USD",
      "redirectURL":"http://136.232.244.190:8081/nimai-uat/#/cst/dsb/subscription",
      "cancelURL":"http://136.232.244.190:8081/nimai-uat/#/cst/dsb/subscription"
    }

    this.onlinePayment.initiatePG(onlinePay).subscribe((response)=>{
      this.enableFeild=true;
      this.detail = JSON.parse(JSON.stringify(response)).data; 

console.log(this.detail)
     // this.srcUrl= "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction&merchant_id="+this.detail.merchantId+"&encRequest="+this.detail.requestDump+"&access_code="+this.detail.accessCode+"&embedded=true"
var url="https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction"

const mapForm = document.createElement('form');
mapForm.method = 'POST';
mapForm.action = url;
mapForm.style.display = 'none';

const mapInput = document.createElement('input');
mapInput.type = 'hidden';
mapInput.name = 'encRequest';
mapInput.value = this.detail.requestDump;
mapForm.appendChild(mapInput);

const mapInput1 = document.createElement('input');
mapInput1.type = 'hidden';
mapInput1.name = 'access_code';
mapInput1.value = this.detail.accessCode;
mapForm.appendChild(mapInput1);
document.body.appendChild(mapForm);

mapForm.submit();
})

console.log(this.detail.requestDump)

  //   const pgData={
  //     "requestDump":this.detail.requestDump,
  //   }
  // this.onlinePayment.PGResponse(pgData).subscribe((response)=>{
  // this.pgDetail = JSON.parse(JSON.stringify(response)).data;
  // })
 
  
      
  }
}