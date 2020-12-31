import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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
  param1: any;
  param2: any;
  $route: any;
  myvar: any;


  constructor(private onlinePayment:OnlinePaymentService,  public activatedRoute: ActivatedRoute ) {
    
 


 // console.log('Called Constructor');
//   this.activatedRoute.queryParams.subscribe(params => {
//       this.param1 = params['encResp'];
//       let urlSearchParams = new URLSearchParams();
//       urlSearchParams.append('password', this.param1);
//       let body = urlSearchParams.toString()
//       console.log(this.param1)
//       console.log(body)
//       const pgData={
//         "requestDump":this.param1,
//       }
//     this.onlinePayment.PGResponse(pgData).subscribe((response)=>{
//     this.pgDetail = JSON.parse(JSON.stringify(response)).data;
//     console.log(this.pgDetail)
//     })
//   });
//   this.param2 = this.activatedRoute.snapshot.params.param2;
// console.log(this.param2)
// let urlSearchParams = new URLSearchParams();
//       urlSearchParams.append('password', this.param1);
//       let body = urlSearchParams.toString()
//       console.log(body)

      // this.$route.params.forEach(param =>
      //   this.myvar = param['encResp']
      // );
      // console.log(this.myvar)

    
//     const pgData2={
//       "requestDump":this.param2,
//     }
//   this.onlinePayment.PGResponse(pgData2).subscribe((response)=>{
//   this.pgDetail = JSON.parse(JSON.stringify(response)).data;
//   console.log(this.pgDetail)
//   })
//   const pgData3={
//     "requestDump":body,
//   }
// this.onlinePayment.PGResponse(pgData3).subscribe((response)=>{
// this.pgDetail = JSON.parse(JSON.stringify(response)).data;
// console.log(this.pgDetail)
// })
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
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.encResp){
console.log(params)
console.log(params.encResp)

      }
   // this.hiddenfields=true;
  // this.submit();
      })
}
  submit(){   


    console.log(this.detail.requestDump)

      const pgData={
        "requestDump":this.detail.requestDump,
      }
    this.onlinePayment.PGResponse(pgData).subscribe((response)=>{
    this.pgDetail = JSON.parse(JSON.stringify(response)).data;
    })

//     const onlinePay={
//       "userId":sessionStorage.getItem('userID'),
//       "merchantId":"45990",
//       "orderId":"",
//       "amount":"4",
//       "currency":"USD",
//       "redirectURL":"http://136.232.244.190:8081/nimai-uat/#/cst/dsb/subscription",
//       "cancelURL":"http://136.232.244.190:8081/nimai-uat/#/cst/dsb/subscription"
//     }

//     this.onlinePayment.initiatePG(onlinePay).subscribe((response)=>{
//       this.enableFeild=true;
//       this.detail = JSON.parse(JSON.stringify(response)).data; 

// console.log(this.detail)
//      // this.srcUrl= "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction&merchant_id="+this.detail.merchantId+"&encRequest="+this.detail.requestDump+"&access_code="+this.detail.accessCode+"&embedded=true"
// var url="https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction"

// const mapForm = document.createElement('form');
// mapForm.method = 'POST';
// mapForm.action = url;
// mapForm.style.display = 'none';

// const mapInput = document.createElement('input');
// mapInput.type = 'hidden';
// mapInput.name = 'encRequest';
// mapInput.value = this.detail.requestDump;
// mapForm.appendChild(mapInput);

// const mapInput1 = document.createElement('input');
// mapInput1.type = 'hidden';
// mapInput1.name = 'access_code';
// mapInput1.value = this.detail.accessCode;
// mapForm.appendChild(mapInput1);
// document.body.appendChild(mapForm);

// mapForm.submit();
// })

 
  
      
  }
}