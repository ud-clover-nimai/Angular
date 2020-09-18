import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { Subscription } from 'src/app/beans/subscription';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { ActivatedRoute, Router } from '@angular/router';
import { loads } from '../../../assets/js/commons';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  public loading = true;
  public isNew = false;
  public isOrder = false;
  public isPayment = false;
  public isPaymentSuccess = false;
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
  showVASPlan = false;
  custUserEmailId: string;
  public isCustomer = false;
  constructor(public activatedRoute: ActivatedRoute, public titleService: TitleService, public subscriptionService: SubscriptionDetailsService, public fb: FormBuilder, public router: Router) {
    this.paymentForm = this.fb.group({});
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });

    let navigation = this.router.getCurrentNavigation();
    console.log(navigation);
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "New-Transaction"){
        console.log("..."+ navigation.extras.state.redirectedFrom);
        this.getSubscriptionDetails();
      }
    }
    else{
      this.getPlan(sessionStorage.getItem("userID"));
    }
  }

  ngOnInit() {
    console.log("init")
    this.custUserEmailId = sessionStorage.getItem('custUserEmailId');
    loads();
    this.titleService.changeTitle(this.title);
    // this.getSubscriptionDetails();
    // this.getPlan(sessionStorage.getItem("userID"));
    var userid = sessionStorage.getItem("userID");
    if((userid.startsWith('CU')) || (userid.startsWith('BC'))){
      this.showVASPlan = true;
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
      this.isNew = true;
      var userid = sessionStorage.getItem("userID");
      if(data)
      {
        if((userid.startsWith('CU'))){
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
     this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])
   }
  public choosePlan(plan: Subscription) {
    this.choosedPlan = plan;
    this.choosedPrice = this.choosedPlan.subscriptionAmount;
    this.addedAmount = this.choosedPrice;
    this.choosedPlan.userId = sessionStorage.getItem('userID');
    this.isNew = false;
    this.isOrder = true;
    this.viewVASPlans();
  }

  viewVASPlans(){
    let data = {
      "country_name": sessionStorage.getItem("registeredCountry")
    }
    this.subscriptionService.viewAdvisory(data).subscribe(response => {
      this.advDetails = JSON.parse(JSON.stringify(response)).data[0];
      if(!this.advDetails){
        this.showVASPlan = false;
      }else{
        this.advPrice = this.advDetails.pricing;
      }
    })
  }

  public payNow(planType) {
    this.isNew = false;
    this.isOrder = false;
    this.isPayment = true;
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
    const formData: FormData = new FormData();
    formData.append('eventName', 'Cust_Splan_email');
    formData.append('emailStatus', 'pending');
    this.subscriptionService.saveSplan(sessionStorage.getItem('userID'), this.choosedPlan)
      .subscribe(
        response => {
          this.isNew = false;
          this.isOrder = false;
          this.isPayment = false;
          this.isPaymentSuccess = true;
          this.titleService.loading.next(false);
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
  }


  public getPlan(userID: string) {

    this.subscriptionService.getPlanByUserId(userID)
      .subscribe(
        response => {

          this.choosedPlan = JSON.parse(JSON.stringify(response)).data[0];          
          if(this.choosedPlan.status.toLowerCase() != "active"){
            this.getSubscriptionDetails();
          }

          this.isNew = false;
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
  nextModule(){
    this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`]);
  }

  addAdvService(event){
    if (event.target.value === "Add") {
      this.addedAmount = parseFloat(this.choosedPrice) + parseFloat(this.advPrice);
      event.target.value = "Remove";
      } else {
      event.target.value = "Add";
      this.addedAmount = this.choosedPrice;
      }
  }

}
