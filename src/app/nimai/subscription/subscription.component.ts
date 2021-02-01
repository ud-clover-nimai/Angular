import { TitleService } from 'src/app/services/titleservice/title.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { Subscription } from 'src/app/beans/subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { loads } from '../../../assets/js/commons';
import { Component, OnInit,ElementRef} from '@angular/core';
import { onlinePaymentDltString } from 'src/app/beans/payment';
import { OnlinePaymentService } from 'src/app/services/payment/online-payment.service';
import {CookieService } from 'ngx-cookie-service';
import { ValidateRegex } from 'src/app/beans/Validations';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  private cookies:string;
  public isRemove=false;
  public isApply=true;
  discountId:any;
  public loading = true;
  public isNew = false;
  public isOrder = false;
  public isPayment = false;
  public isPaymentSuccess = false;
  public isvasapplied:any;
   
  public title: string = "Subscription Details";
  public choosedPlan: Subscription = new Subscription();
  public paymentForm: FormGroup;
  public timeStamp = new Date();
  public parentURL: string = "";
  public subURL: string = "";
  advDetails: any = "";
  advPrice: any;
  choosedPrice: any;
  addedAmount: any;
  grandTotal:any;
  showVASPlan = false;
  callVasService=false;
  isRenew = false;
  isnewPlan=false;
isRenewPlan=false;
  vas_id:any;
  branchUserEmailId: string;
  custUserEmailId:string;
  public isCustomer = false;
  status: any;
  hideRenew: boolean;
  couponError=false;
  couponSuccess:any;
  amountAfterCoupon:any;
  discount:any;
  public data: onlinePaymentDltString;
  paymentTransactionId:any;
  detail: any="";
  pgDetail: any;
  param1: any;
  param2: any;
  pgstatus: void;
  creditStatus: any="";
  
  constructor(private cookieService:CookieService, private onlinePayment:OnlinePaymentService,public activatedRoute: ActivatedRoute, public titleService: TitleService, public subscriptionService: SubscriptionDetailsService, public fb: FormBuilder, public router: Router,private el: ElementRef) {
    this.paymentForm = this.fb.group({
      merchantId:[''],
      orderId:[''],
      currency:[''],
      amount:[''],
      redirectURL:[''],
      cancelURL:[''],
    });
   
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });

    let navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "New-Transaction"){
        this.getSubscriptionDetails();
      }
    }
    else{
      this.getPlan(sessionStorage.getItem("userID"));
    }
  
  }

  ngOnInit() {    

    this.branchUserEmailId = sessionStorage.getItem('branchUserEmailId');
    this.custUserEmailId=sessionStorage.getItem('custUserEmailId');
   
    loads();
    this.titleService.changeTitle(this.title);
    this.getStatus(); 
    this.getpaymentGateway();
  }

  getpaymentGateway(){

  this.cookies= this.cookieService.get('status');
  console.log(this.cookies)
  if(this.cookies=='Success'){
   // this.paymentTransactionId=this.cookieService.get('orderId');
    this.payment(this.cookies);

  }else if(this.cookies=='Failure'){
    document.cookie = 'status' +'=; Path=/';

    const navigationExtras: NavigationExtras = {
      state: {
        title: 'Transaction has been failed',
        message:'',
        parent: this.subURL + '/' + this.parentURL + '/subscription'
      }
    };          
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
    .then(success => console.log('navigation success?', success))
    .catch(console.error);
  }); 


  }else{
    console.log("this.cookies")

    console.log(this.cookies)

  }
  
  }
  subscriptionDetails = [];
  getSubscriptionDetails() {
    this.titleService.loading.next(true);
    let req = {
      "userId": sessionStorage.getItem('userID'),
      "countryName": sessionStorage.getItem('registeredCountry')
    }
    this.subscriptionService.getPlansByCountry(req).subscribe(data => {      
      if(!this.isRenew){
        this.isNew = true;
        this.isnewPlan=true;
      }else{
        this.isNew = false;
      }    
      var userid = sessionStorage.getItem("userID");
    if(data)
      {
        if((userid.startsWith('CU'))){
          this.subscriptionDetails = data.data.customerSplans;
          this.isCustomer=true;
        } else if(userid.startsWith('BC')){
          this.subscriptionDetails = data.data.customerSplans;
          this.isCustomer=true;
        }
        else{
        this.subscriptionDetails = data.data.banksSplans;
          this.isCustomer=false;
        }
      }
      this.loading = false;
    }
    )
  }
  //added by ashvini -  “Next” button in the payment successful  page
  gotokyc(){
     //this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])
     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
     }); 
   }
  public choosePlan(plan: Subscription,flag:string) {
   
    this.choosedPlan = plan;
    this.choosedPlan.flag=flag;
    sessionStorage.setItem('flag',flag);
    sessionStorage.setItem("subscriptionamount", plan.subscriptionAmount.toFixed(2));
    sessionStorage.setItem("subscriptionid", plan.subscriptionId);

    this.choosedPrice = this.choosedPlan.subscriptionAmount;
    this.addedAmount = this.choosedPrice;
    this.choosedPlan.userId = sessionStorage.getItem('userID');
    this.isNew = false;
    this.isRenew=false;
    this.isPaymentSuccess=false;
    this.isOrder = true;
    console.log(plan)
    this.viewVASPlans();
    // if(this.choosedPlan.flag=='new' || sessionStorage.getItem(flag)=='new'){
    //   this.payNowSave('CreditPending',this.choosedPlan);
    // }
  }

  viewVASPlans(){
    var userid = sessionStorage.getItem("userID");   
      if((userid.startsWith('CU')) || (userid.startsWith('BC'))){
        this.showVASPlan = true;
      }
    else{
      this.showVASPlan = false;
    }   
    let data = {
      "country_name": sessionStorage.getItem("registeredCountry")
    }
    this.subscriptionService.viewAdvisory(data,userid).subscribe(response => {
      
      this.advDetails = JSON.parse(JSON.stringify(response)).data[0];
      if(!this.advDetails){
        
        this.showVASPlan = false;
      }else{
        this.advPrice = this.advDetails.pricing;
        // if(this.advPrice){
        //   this.choosedPlan.subscriptionAmount=this.choosedPlan.subscriptionAmount+this.advPrice
        // }
         sessionStorage.setItem('vasId',this.advDetails.vas_id)

        this.vas_id=this.advDetails.vas_id
      }
    })
  }
  removeCoupon(){
    let req = {
      "discountId": this.discountId
    }
    this.subscriptionService.removeCoupon(req).subscribe(response => {
       let data= JSON.parse(JSON.stringify(response))
        const first_input = this.el.nativeElement.querySelector('.coupantext');
        first_input.value=null;
        this.isRemove=false;
        this.isApply=true;        
        this.discountId="0";
        this.discount="0";
        if(this.callVasService)
        {
          this.addedAmount = this.choosedPrice+parseFloat(this.advPrice);
        }
        else
        {
          this.addedAmount=this.choosedPrice;
          this.amountAfterCoupon=this.choosedPrice;
        }  
        this.couponSuccess=false;
    }
    )
  }
  applyNow(val){
    let req = {
      "userId": sessionStorage.getItem('userID'),
      "subscriptionName":this.choosedPlan.subscriptionName,
	    "coupenCode":val,
	    "subscriptionAmount":this.choosedPlan.subscriptionAmount,
      "subscriptionId":this.choosedPlan.subscriptionId
    }
   
    this.subscriptionService.applyCoupon(req).subscribe(response => {
       let data= JSON.parse(JSON.stringify(response))
       this.isRemove=true;
       this.isApply=false;
       if(data.status=="Failure"){
         this.couponError=true;
         this.isRemove=false;
         this.isApply=true;
       }else{
        this.couponSuccess=data.status;
        this.isRemove=true;
        this.isApply=false;
        this.amountAfterCoupon = Number(data.data.grandAmount);
        this.discount=Number(data.data.discount);
        this.discountId=data.data.discountId
        if(this.callVasService)
        {
          this.addedAmount = this.amountAfterCoupon+parseFloat(this.advPrice);
        }
        else
        {
          this.addedAmount=this.amountAfterCoupon
        }  
        this.couponError=false;
       }
    }
    )
  }
  public payNow(planType) {

    this.paymentForm.patchValue({
      amount: this.addedAmount,
      currency:'USD'
    });
    let elements = document.getElementsByTagName('input');
    for (var i = 0; i < elements.length; i++) {
      if(elements[i].value)
      elements[i].classList.add('has-value')
    }
    this.isNew = false;
    this.isRenew=false;
    this.isOrder = false;
    this.isPayment = true;
    this.isPaymentSuccess=false;
    const sd = this;
    $('.green').hide();
    $('.selection').hide();
    $('.red').hide();
    $('.green').slideUp();
    $('.red').slideUp();
    $('#planUnlimited').show();
    $("#option-one"). prop("checked", true);
    // this.titleService.loading.next(true);
    $(document).ready(function () {
      if(planType == "unlimited"){
        $('.green').show();
        $('.selection').hide();
        $('#planUnlimited').hide();
      }else{
        $('.red').show();

        $('.selection').show();
        $('#planUnlimited').show();
       
      }
      $('input[type="radio"]').click(function () {
        sd.loading = true;
        var inputValue = $(this).attr("value");
        if (inputValue == 'red') {
          $('.red').slideDown();
          $('.green').slideUp();
          // this.titleService.loading.next(false);
        }
        else {
          // this.titleService.loading.next(false);
          $('.red').slideUp();
          $('.green').slideDown();
        }
      });
    });
    // this.titleService.loading.next(false);
  }


  getGrandAmount(){
    console.log(this.choosedPrice)
  this.paymentForm.patchValue({
    amount: this.choosedPrice,
  })
  }
  public payment(cdstatus) {
    this.titleService.loading.next(true);
    this.choosedPlan.emailID=this.branchUserEmailId  
    this.choosedPlan.vasAmount=this.advPrice;
    this.choosedPlan.grandAmount=this.addedAmount
    this.choosedPlan.discount=this.discount;
    this.choosedPlan.discountId=this.discountId;
    this.choosedPlan.modeOfPayment="Credit" ;
    this.choosedPlan.subscriptionId=sessionStorage.getItem('subscriptionid');

    this.choosedPlan.flag=this.cookieService.get('subsflag');       
    this.choosedPlan.customerSupport= this.cookieService.get('custSupport');
    this.choosedPlan.lcCount=this.cookieService.get('lcCount');
    this.choosedPlan.relationshipManager= this.cookieService.get('relManager');
    this.choosedPlan.subscriptionAmount= Number(this.cookieService.get('subsAmount'));
    this.choosedPlan.subscriptionName= this.cookieService.get('subsName');
    this.choosedPlan.subscriptionValidity= this.cookieService.get('subsValidity');
    this.choosedPlan.subsidiaries= this.cookieService.get('subsidiaries');
    this.choosedPlan.userId=this.cookieService.get('userId');
   // this.choosedPlan.vasAmount=this.cookieService.get('vasAmount');
    console.log(this.choosedPlan)


    if(this.isnewPlan){
      this.choosedPlan.flag="new"
    }
    if(this.isRenewPlan){
      this.choosedPlan.flag="renew"
    }
    if(this.vas_id && this.callVasService){
      let req = {
        "userId": sessionStorage.getItem('userID'),
        "vasId": this.vas_id,
        "subscriptionId":this.choosedPlan.subscriptionId
      }
      this.subscriptionService.addVas(req).subscribe(data => {
      }
      )
    }
    
    this.subscriptionService.saveSplan(sessionStorage.getItem('userID'), this.choosedPlan)
      .subscribe(
        response => {
          let data= JSON.parse(JSON.stringify(response))
          if(data.data)
          this.paymentTransactionId=this.cookieService.get('orderId');
          this.isNew = false;
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);
          console.log(cdstatus)
         if(cdstatus=='Success'){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'SubscriptionPlan',
                message: data.errMessage,
                parent: this.subURL + '/' + this.parentURL + '/subscription'
              }
            };          
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          }); 
        }
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
      document.cookie = 'status' +'=; Path=/';

  }
  public getPlan(userID: string) {
    if((userID.startsWith('CU'))){
  
      this.isCustomer=true;
    }
    else{
      this.isCustomer=false;
    }
    this.subscriptionService.getPlanByUserId(userID)

      .subscribe(
        response => {
          this.choosedPlan = JSON.parse(JSON.stringify(response)).data[0];   
          let reData=JSON.parse(JSON.stringify(response)).data[0]       
          if(this.choosedPlan.status.toLowerCase() != "active"){
            this.getSubscriptionDetails();
          }
          if(reData.isVasApplied=="1")
            this.viewVASPlans()
          if(reData.grandAmount)
            this.choosedPlan.subscriptionAmount=Number(sessionStorage.getItem("subscriptionamount"));
            console.log(this.choosedPlan.subscriptionAmount)
         this.isNew = false
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);
        
        },
        (error) => {
          this.titleService.loading.next(false);
          this.getSubscriptionDetails();
        }
      )
  }
  sendAccDetails(){    
      let req = {
        "userId": sessionStorage.getItem('userID'),
        "event":"Account_Details",
      }
      this.subscriptionService.sendAccDetails(req).subscribe(data => {
        alert("bank details sent successfully")
      }
      )
  }
  sendRequest(){
    this.cookieService.delete('status');
    document.cookie = 'status' +'=; Path=/';
    document.cookie = 'paymentMode' +'=; Path=/';

    this.titleService.loading.next(true);
    this.choosedPlan.emailID=this.branchUserEmailId    
    this.choosedPlan.modeOfPayment="Wire"
    this.choosedPlan.vasAmount=this.advPrice;
    this.choosedPlan.grandAmount=this.addedAmount
    this.choosedPlan.discount=this.discount;
    this.choosedPlan.discountId=this.discountId;
    if(this.isnewPlan){
      this.choosedPlan.flag="new"
    }
    if(this.isRenewPlan){
      this.choosedPlan.flag="renew"
    }
    if(this.vas_id && this.callVasService){
      let req = {
        "userId": sessionStorage.getItem('userID'),
        "vasId": this.vas_id,
        "subscriptionId":this.choosedPlan.subscriptionId
      }
      this.subscriptionService.addVas(req).subscribe(data => {
       // console.log("data---",data)
      }
      )
    } 
    this.subscriptionService.saveSplan(sessionStorage.getItem('userID'), this.choosedPlan)
      .subscribe(
        response => {
          let data= JSON.parse(JSON.stringify(response))
          if(data.data)
            this.paymentTransactionId=data.data
          this.isNew = false;
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);
          if(data.status=="Failure"){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Oops! Something went wrong while Renewing the plan',
                message: data.errMessage,
                parent: this.subURL + '/' + this.parentURL + '/subscription'
              }
            };          
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
            this.isPaymentSuccess = true;
          }); 
          }else {
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'SubscriptionPlan',
                message: data.errMessage,
                parent: this.subURL + '/' + this.parentURL + '/subscription'
              }
            };          
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          }); 
          }
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
    //this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`]);
  }
  addAdvService(event){
    if (event.target.value === "Add") {
      this.callVasService=true;
      if(this.amountAfterCoupon){
        this.addedAmount=parseFloat(this.amountAfterCoupon)+parseFloat(this.advPrice);
      }
      else{
        this.addedAmount = parseFloat(this.choosedPrice) + parseFloat(this.advPrice);
      }
      event.target.value = "Remove";
      } else {
       
      this.callVasService=false;  
      event.target.value = "Add";
      if(this.amountAfterCoupon){
        this.addedAmount= this.amountAfterCoupon
      }
      else{  
        this.addedAmount = this.choosedPlan.subscriptionAmount;
      }
    }      
  }
  renewPlan(){
    this.isRenew=true;
    this.isRenewPlan=true;
    this.isPaymentSuccess=false;
    this.getSubscriptionDetails() 
  }

  getStatus(){
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": ""
    }
    this.subscriptionService.getTotalCount(data).subscribe(
      response => {        
        this.status = JSON.parse(JSON.stringify(response)).data;
        if(this.cookieService.get('paymentMode')=='Credit'){
          this.paymentTransactionId=this.cookieService.get('orderId');
        }else{
          this.paymentTransactionId=this.status.paymentTransId;
        }
        if(this.status.kycstatus=='Approved'){
         this.hideRenew=true;
        }else{
          this.hideRenew=false;
        }      
      
    
      });
  }


  
  submit(){   
  let orderid="";
  function makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log(text)
    orderid=text;
  }
  let possible = "ABCDEFGHZ1456912";
  const lengthOfCode = 15;
  makeRandom(lengthOfCode, possible);

    const onlinePay={
      "userId":sessionStorage.getItem('userID'),
      "merchantId":"45990",
      "orderId":orderid,
      "amount":this.addedAmount,
      "currency":this.paymentForm.get('currency').value,
        "redirectURL":"http://136.232.244.190:8081/nimaiSPlan/PGResponse",
       "cancelURL":"http://136.232.244.190:8081/nimaiSPlan/PGResponse",
      // "redirectURL":"http://203.115.123.93:8080/nimaiSPlan/PGResponse",
      //  "cancelURL":"http://203.115.123.93:8080/nimaiSPlan/PGResponse",
      // "redirectURL":"http://nimai-pilot-lb-468660897.me-south-1.elb.amazonaws.com/nimaiSPlan/PGResponse",
      // "cancelURL":"http://nimai-pilot-lb-468660897.me-south-1.elb.amazonaws.com/nimaiSPlan/PGResponse",
        //  "redirectURL":"https://uat.nimaitrade.com/nimaiSPlan/PGResponse",
        //  "cancelURL":"https://uat.nimaitrade.com/nimaiSPlan/PGResponse",

       

     "merchantParam1":sessionStorage.getItem('userID'),
     "merchantParam2":sessionStorage.getItem('subscriptionid'),
     "merchantParam3":sessionStorage.getItem('flag'),
     "merchantParam4":sessionStorage.getItem('vasId'),
    }

    this.onlinePayment.initiatePG(onlinePay).subscribe((response)=>{
      this.detail = JSON.parse(JSON.stringify(response)).data; 

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
 
      
  }
  
  validateRegexFields(event, type){
    var key = event.keyCode;
   
      if(type=="name_validation"){
        this.couponError=false
        if (!((key >= 65 && key <= 90) ||(key < 33 || key > 47) ||(key < 48 || key > 57) || (key < 58 || key > 64) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/)) {

          event.preventDefault();
      }
      // else if (key==8){
      //   this.couponSuccess=false;
      // } 
    }
   
  }
}

