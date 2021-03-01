import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import * as $ from '../../../../assets/js/jquery.min';
import { FormGroup, FormControl } from '@angular/forms';
import {Validators} from '@angular/forms';
import  { ValidateRegex } from '../../../beans/Validations';
import { SignupService } from 'src/app/services/signup/signup.service';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { loads } from '../../../../assets/js/commons'
import { TitleService } from 'src/app/services/titleservice/title.service';
@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {
  public parent: string;
  emailAddress: any;
  submitted: boolean = false;
  passCode: any;
  passValue: any;
  errMessage: any;
  userId: string;

  constructor(public titleService: TitleService,public router: Router, public Service: SignupService, public fps: ForgetPasswordService, private el: ElementRef) {

    let navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      parent: string
    };
    this.parent = state.parent;
  }

  customerLoginForm = new FormGroup({
    //batch_id: new FormControl('', [Validators.required,Validators.minLength(3)]),
    employee_id: new FormControl('', [Validators.required,Validators.minLength(3)]),
    email_id: new FormControl('', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]),
    employee_name: new FormControl('', [Validators.required])
  })

  get custLogDetails() {
    return this.customerLoginForm.controls;
  }

  ngOnInit() {


    this.userId=sessionStorage.getItem('userID');
    if(this.userId.startsWith('RE')){
     // $('.modal1').show();
     let kycStatus=sessionStorage.getItem("kStatus")
     if(kycStatus=="KycStauts:Approved"){
       $('.modal1').show();
 
       }else{  
         this.onBALoginClick()
         $('.modal2').show();
 
       }
    }else if(this.userId.startsWith('BA')){
      this.onBALoginClick()
      $('.modal2').show();

    }else if(this.userId.startsWith('BC')){
      $('.modal1').show();

  }else if(this.userId.startsWith('CU')){
    let kycStatus=sessionStorage.getItem("kStatus")
    if(kycStatus=="KycStauts:Approved"){
      $('.modal1').show();

      }else{  
        this.onBALoginClick()
        $('.modal2').show();

      }
    


  }



    loads();
  }
  ngAfterViewInit() {
    /*added by ashvini -Default cursor should be present in the Branch ID field of the Enter Access Details page of the Bank as Customer. */
    const first_input = this.el.nativeElement.querySelector('.first_input');
    first_input.focus();
  }
  close() {
    $('.modal1').hide();
    if (this.parent === 'login') {
      this.router.navigate(['/' + this.parent]);
    } else {
      this.router.navigate(['/nimai/' + this.parent]);
    }
  }



  onBALoginClick() {    

        let sendEmail = {
          "event": 'ADD_BRANCH_USER',
          "userId": sessionStorage.getItem("userID"),
        }
        this.fps.sendBranchUserPasscode(sendEmail)
          .subscribe(
            (response) => {
             this.passCode = JSON.parse(JSON.stringify(response));
             this.passCode = this.passCode.data;
              sessionStorage.setItem('branchUserEmailId', this.emailAddress);
              $('.modal1').hide();
              $('.modal2').show();
            },
            (error) => {
              $('.modal1').hide();
              $('.modal3').show();
              // alert("unable to send mail")

            }
          )     
  }

  onLoginClickWOA(){
  let sendEmail = {
    "event": 'ADD_BRANCH_USER',
    "emailId": this.emailAddress,
    "userId": sessionStorage.getItem("userID"),
    "branchId": ""
  }
  this.fps.sendEmailBranchUser(sendEmail)
    .subscribe(
      (response) => {
       this.passCode = JSON.parse(JSON.stringify(response));
       this.passCode = this.passCode.data;
        sessionStorage.setItem('branchUserEmailId', this.emailAddress);
        $('.modal1').hide();
        $('.modal2').show();
      },
      (error) => {
        $('.modal1').hide();
        $('.modal3').show();
        // alert("unable to send mail")

      }
    )

}

  onCustLoginClick() {    
    this.submitted = true;
    this.emailAddress = this.customerLoginForm.get('email_id').value.trim();
    this.customerLoginForm.get('email_id').setValue(this.customerLoginForm.get('email_id').value.trim())
    if (this.customerLoginForm.invalid) {
      return;
    }
    this.submitted = false;   
    let userID: string = sessionStorage.getItem('userID');
    this.Service.userBranch(this.customerLoginForm.value,userID).subscribe(
      (response) => {
      let responseData = JSON.parse(JSON.stringify(response));
      var matches = responseData.data.match(/\d+/g)
      sessionStorage.setItem('custUserEmailId', this.emailAddress);
     
      if (matches != null) {
      
        let sendEmail = {
          "event": 'ADD_BRANCH_USER',
          "emailId": this.emailAddress,
          "userId": sessionStorage.getItem("userID"),
          "branchId": responseData.data
        }
        this.fps.sendEmailBranchUser(sendEmail)
          .subscribe(
            (response) => {
             this.passCode = JSON.parse(JSON.stringify(response));
             this.passCode = this.passCode.data;
              sessionStorage.setItem('branchUserEmailId', this.emailAddress);
              $('.modal1').hide();
              $('.modal2').show();
            },
            (error) => {
              $('.modal1').hide();
              $('.modal3').show();
              // alert("unable to send mail")

            }
          )


          
        }
        else{
          $('.modal1').hide();
          $('.modal3').show();
        }
      },
      (error) => { }
    );

  }

  passCodeValue(){
      this.errMessage = "";
  }

  onOTPClick() {
    this.titleService.loading.next(true);
    if(!this.passValue){
      this.errMessage = "Kindly enter code!";
      return;
    }
    
    var data = {
      "token" : this.passCode.split('_')[0],
      "passcodeValue": this.passValue
    }
    
    this.fps.branchUserOTP(data).subscribe(
      (response) => {
        var response = JSON.parse(JSON.stringify(response));
        if(response.flag == 1){
          this.titleService.loading.next(false);
          let kycStatus=sessionStorage.getItem("kStatus")
          if(response.data.userId.startsWith('BC')){
            if(kycStatus=="KycStauts:Approved"){
              this.router.navigate(['/cst/dsb/dashboard-details']);   
            }else if(kycStatus=="KycStauts:Rejected"){
              this.router.navigate(['/cst/dsb/kyc-details']);   
            }else {
              this.router.navigate(['/cst/dsb/personal-details']);   
            }
          }
         else if(response.data.userId.startsWith('CU')){
          if(kycStatus=="KycStauts:Approved"){
            this.router.navigate(['/cst/dsb/dashboard-details']); 
          }else if(kycStatus=="KycStauts:Rejected"){ 
            this.router.navigate(['/cst/dsb/kyc-details']); 
          }else{
            this.router.navigate(['/cst/dsb/personal-details']); 
          }
        }
          else if(response.data.userId.startsWith('BA')){
            if(kycStatus=="KycStauts:Approved"){
              this.router.navigate(['/bcst/dsb/dashboard-details']);  
            }else if(kycStatus=="KycStauts:Rejected"){
              this.router.navigate(['/bcst/dsb/kyc-details']);   
            }else{  
              this.router.navigate(['/bcst/dsb/personal-details']);  
            }
          }
          else if(response.data.userId.startsWith('RE')){
            if(kycStatus=="KycStauts:Approved"){
            this.router.navigate(['/ref/rcs/dashboard-details']);   
            }else if(kycStatus=="KycStauts:Rejected"){
            this.router.navigate(['/ref/rcs/kyc-details']);   
            }else{  
            this.router.navigate(['/ref/rcs/personal-details']);    
            }
          }
          $('.modal2').hide();
        } else{
          this.errMessage = response.message;
        }
      },
      (err) => {}
    )
  }

  reenterCustLoginDetails() {
    $('.modal3').hide();
    $('.modal1').show();
  }

  validateRegexFields(event, type){
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }else if(type=="namewithspace"){
      var key = event.keyCode;
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/ || (event.shiftKey && key === 55) || key===190 /* . key*/)) {
          event.preventDefault();
      }    
    }
  }

}
