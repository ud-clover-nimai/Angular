import { TitleService } from 'src/app/services/titleservice/title.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { Subscription } from 'src/app/beans/subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { loads } from '../../../assets/js/commons';
import { Component, OnInit,ElementRef} from '@angular/core';
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
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
  paymentTransactionId:any;
  
  constructor(public activatedRoute: ActivatedRoute, public titleService: TitleService, public subscriptionService: SubscriptionDetailsService, public fb: FormBuilder, public router: Router,private el: ElementRef) {
    this.paymentForm = this.fb.group({});
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });

    let navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state){
      console.log(navigation.extras.state.redirectedFrom)
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
    this.paymentTransactionId=sessionStorage.getItem('paymentTransId');
    loads();
    this.titleService.changeTitle(this.title);
    this.getStatus();
  

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
  public choosePlan(plan: Subscription) {
    this.choosedPlan = plan;
    this.choosedPrice = this.choosedPlan.subscriptionAmount;
    this.addedAmount = this.choosedPrice;
    this.choosedPlan.userId = sessionStorage.getItem('userID');
    this.isNew = false;
    this.isRenew=false;
    this.isPaymentSuccess=false;
    this.isOrder = true;
    this.viewVASPlans();
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
    this.subscriptionService.viewAdvisory(data).subscribe(response => {
      this.advDetails = JSON.parse(JSON.stringify(response)).data[0];

      if(!this.advDetails){
        this.showVASPlan = false;
      }else{
        this.advPrice = this.advDetails.pricing;
        // if(this.advPrice){
        //   this.choosedPlan.subscriptionAmount=this.choosedPlan.subscriptionAmount+this.advPrice
        // }
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

  public payment() {
    this.titleService.loading.next(true);
    this.choosedPlan.emailID=this.branchUserEmailId  
    this.choosedPlan.vasAmount=this.advPrice;
    this.choosedPlan.grandAmount=this.addedAmount
    this.choosedPlan.discount=this.discount;
    this.choosedPlan.discountId=this.discountId;
    this.choosedPlan.modeOfPayment="Credit" 
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
        //  this.viewVASPlans();  
          }
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
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
            this.choosedPlan.subscriptionAmount=reData.grandAmount  
         
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
        this.addedAmount = this.choosedPrice;
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
        if(this.status.kycstatus=='Approved'){
         this.hideRenew=true;
        }else{
          this.hideRenew=false;
        }      
      });
  }


}

