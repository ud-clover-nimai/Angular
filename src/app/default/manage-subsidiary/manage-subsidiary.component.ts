import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,NavigationExtras} from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { loads } from '../../../assets/js/commons';
import { ValidateRegex } from 'src/app/beans/Validations';
import { formatDate } from '@angular/common';
import { SignupService } from 'src/app/services/signup/signup.service';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
@Component({
  selector: 'app-manage-subsidiary',
  templateUrl: './manage-subsidiary.component.html',
  styleUrls: ['./manage-subsidiary.component.css']
})
export class ManageSubsidiaryComponent implements OnInit {
  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  respMessage: any;
  status:any;
  resp: any;
  subsidiaryData:any;
  noData:any;
  subsidiries:any;
  subuticount:any;
  available:any;
  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ForgetPasswordService, public signUpService: SignupService) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
  }
  manageSubForm = this.formBuilder.group({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    mobileNo: new FormControl('',[Validators.required,Validators.minLength(7)]),
    country: new FormControl('',[Validators.required]),
    landlineNo: new FormControl('',[Validators.minLength(7)]),
    emailId: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")])
  });

  get manageSubDetails() {
    return this.manageSubForm.controls;
  }

  ngOnInit() {
  loads();
  manageSub();
  this.subsidiries=sessionStorage.getItem('subsidiries');  
  this.subuticount=sessionStorage.getItem('subuticount');
  this.available=this.subsidiries-this.subuticount
  this.listOfSubsidiary();
  }

  close() {
    // this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
    $("#addsub").hide();
  }
  listOfSubsidiary(){  
    let userID: string = sessionStorage.getItem('userID');
    this.signUpService.getSubsidiaryList(userID).subscribe(
      (response) => {
        this.subsidiaryData = JSON.parse(JSON.stringify(response)).data;
        if(this.subsidiaryData.length === 0){
          this.noData = true;
        }
        
      },(error) =>{
        this.noData = true;
      }
      )
  }
  onOkClick(){    
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //       this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
    //   });
      window.location.reload()
      $("#addsub").hide();
  }

  addSubsidiary() {
    $("#addsub").show();
    this.manageSubForm.reset();
    this.respMessage = "";
  }

  onSubmit() {
    this.submitted = true;
    if (this.manageSubForm.invalid) {
      return;
    }
    this.submitted = false;
    let data = {
      firstName: this.manageSubForm.get('firstName').value,
      lastName: this.manageSubForm.get('lastName').value,
      emailAddress: this.manageSubForm.get('emailId').value,
      mobileNum: this.manageSubForm.get('mobileNo').value,
      countryName: this.manageSubForm.get('country').value,
      landLinenumber: this.manageSubForm.get('landlineNo').value,
      companyName: '',
      designation: '',
      businessType: '',
      userId: "",
      bankType: 'customer',
      subscriberType: 'customer',
      minLCValue: '0',
      interestedCountry: [],
      blacklistedGoods: [],
      account_source: sessionStorage.getItem('userID'),
      account_type: "SUBSIDIARY",
      account_status: "ACTIVE",
      account_created_date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
      regCurrency: "",
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: ""
    }


    this.signUpService.signUp(data).subscribe((response) => {
     
    let res= JSON.parse(JSON.stringify(response))
    this.respMessage =res.errMessage
   
    const fg = {
      "emailId": this.manageSubForm.get('emailId').value,
      "event": 'ADD_SUBSIDIARY',
      "userId": sessionStorage.getItem('userID')
      //"referenceId":res.data.reId
    }
   
    if(res.status!=="Failure"){
    this.fps.sendEmailReferSubsidiary(fg)
    .subscribe(
      (response) => {
        this.resetPopup();
        this.respMessage = "You've successfully invited to join TradeEnabler. You will be notified once invitee complete the signup process."
      },
      (error) => {
        this.resetPopup();
        this.respMessage = "Service not working! Please try again later."
      }
    )
   }else{
    
    this.resetPopup();
    this.respMessage = res.errMessage;
   }

   },
   (error) => {
    
    let err= JSON.parse(JSON.stringify(error.error))
     this.resetPopup();
     this.respMessage = err.errMessage
   }
  )
 }
 resetPopup(){
  $('#authemaildiv').slideUp();
  $('#paradiv').slideDown();
  $('#okbtn').show();
  $('#btninvite').hide();
  this.manageSubForm.reset();
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
  }else if(type=="name_validation"){
    var key = event.keyCode;
    if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/)) {
        event.preventDefault();
    }    
  }
}
}
