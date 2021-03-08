import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from 'src/assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'
import { ValidateRegex } from 'src/app/beans/Validations';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { formatDate } from '@angular/common';
import { ReferService } from 'src/app/services/refer/refer.service';
import { loads} from '../../../assets/js/commons'
import { SignupService } from 'src/app/services/signup/signup.service';
@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class ReferComponent implements OnInit {

  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  CompanyName: any;
  getCurrentDate: any;
  showBranchUserId: boolean = false;
  resp: any;
  referViewDetails : any;
  respMessage: string;
  total_references:number;
  total_earning:number;
  countryNames: any;
  countryCode: any;
  hasCountrycode: boolean=false;
  CompanyName_: any="";
  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ForgetPasswordService, public service:ReferService, public signUpService: SignupService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.getCurrentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en'); 

    if(sessionStorage.getItem('userID').startsWith('BC')){
      this.showBranchUserId = false;
    }
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));

  }

  referForm = this.formBuilder.group({
    userId: sessionStorage.getItem('userID'),
    // referenceId: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobileNo: ['', [Validators.required,Validators.minLength(7)]],
    landLineNo:['', [Validators.minLength(7)]],
    emailAddress: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]),
    countryName: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    status: new FormControl('ACTIVE'),
    insertedDate: this.getCurrentDate,
    modifiedDate: this.getCurrentDate,
    branchUserId: new FormControl(''),
    insertedBy: new FormControl({fieldName:'firstName'}),
    modifiedBy: new FormControl({fieldName:'firstName'}),

  });

  get referDetails() {
    return this.referForm.controls;
  }

  ngOnInit() {
    this.total_earning=0;
    loads();
    manageSub();
    this.viewReferDetails(sessionStorage.getItem('userID'));
    
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
  }

  close() {
    $("#addsub").hide();
    this.referForm.reset();
  }

  onOkClick(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/refer`]);
      });
      $("#addsub").hide();
  }

  addRefer() {
    $("#addsub").show();
    this.referForm.reset();
    this.respMessage = "";
  }

  onSubmit() {
    //alert("1")
    this.submitted = true;
    if (this.referForm.invalid) {
      return;
    }
    const data = {
      userId: sessionStorage.getItem('userID'),
      // referenceId: this.referForm.get('referenceId').value,
      firstName: this.referForm.get('firstName').value,
      lastName: this.referForm.get('lastName').value,
      mobileNo: this.referForm.get('mobileNo').value,
      landLineNo:this.referForm.get('landLineNo').value,
      emailAddress: this.referForm.get('emailAddress').value,
      countryName: this.countryNames,
      companyName: this.referForm.get('companyName').value,
      status: 'PENDING',
      insertedDate: this.getCurrentDate,
      modifiedDate: this.getCurrentDate,
      branchUserId: 'TEST',//this.referForm.get('branchUserId').value,
      insertedBy: this.referForm.get('firstName').value,
      modifiedBy: this.referForm.get('firstName').value
    }  
    
    let request = {

      firstName: this.referForm.get('firstName').value,
      lastName: this.referForm.get('lastName').value,
      emailAddress: this.referForm.get('emailAddress').value,
      mobileNum: this.referForm.get('mobileNo').value,
      countryName: this.countryNames,
      landLinenumber: this.referForm.get('landLineNo').value,
      companyName: this.referForm.get('companyName').value,
      designation: '',
      businessType: '',
      userId: sessionStorage.getItem('userID'),
      bankType: 'customer',
      subscriberType: 'customer',

      minLCValue: '0',
      interestedCountry: [],
      blacklistedGoods: [],
      account_source: sessionStorage.getItem('userID'),
      account_type: "REFER",
      account_status: "ACTIVE",
      account_created_date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
      regCurrency: "",
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: ""

    }
    
    this.submitted = false;
    this.CompanyName = this.referForm.get('companyName').value;
    this.signUpService.signUp(request).subscribe((response) => {
      let resp = JSON.parse(JSON.stringify(response));
      this.CompanyName_=resp.data.companyName

    this.service.addRefer(data)
      .subscribe(
        (response) => {
          let res = JSON.parse(JSON.stringify(response));
          
          const fg = {
            "emailId": this.referForm.get('emailAddress').value,
            "event": 'ADD_REFER',
            "userId": sessionStorage.getItem('userID'),
            "referenceId":res.data.reId
          }
          this.fps.sendEmailReferSubsidiary(fg)
            .subscribe(
              (response) => {
                this.resetPopup();
                this.respMessage = "You've successfully invited " + this.CompanyName_+ " to join TradeEnabler. You will be notified once the invitee completes the sign up processes."
              },
              (error) => {
                this.resetPopup();
                this.respMessage = "Service not working! Please try again later."
              }
            )
        },
        (error) => {
          this.resetPopup();
          this.respMessage = "Service not working! Please try again later."
        }
      )},
      (error) => {
        $('#authemaildiv').slideDown();
        $('#paradiv').slideDown();
        $('#okbtn').hide();
        $('#btninvite').show();  
        this.respMessage = JSON.parse(JSON.stringify(error.error)).errMessage;
      }
    )


  }

  resetPopup(){
    $('#authemaildiv').slideUp();
    $('#paradiv').slideDown();
    $('#okbtn').show();
    $('#btninvite').hide();
    this.referForm.reset();
  }

  validateRegexFields(event, type) {
    var key = event.keyCode;
    if (type == "number") {
      ValidateRegex.validateNumber(event);
    }
    else if (type == "alpha") {
      ValidateRegex.alphaOnly(event);
    }
    else if (type == "alphaNum") {
      ValidateRegex.alphaNumeric(event);
    }else if(type=="name_validation"){
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/|| key==32/*SPACE*/)) {
          event.preventDefault();
      }    
    }else if(type=="mobile_number"){
      if (key!= 43 && key > 31 && (key < 48 || key > 57)) {
        event.preventDefault();
    }
    }
  }

  viewReferDetails(userID: string) {
    this.service.viewRefer(userID)
      .subscribe(
        (response) => {
          let responseData = JSON.parse(JSON.stringify(response));
          let total = 0;
          for (let i = 0; i < responseData.length; i++) {
            total +=Number(responseData[i].earnings);
          }
          this.total_earning=total;
          this.referViewDetails = responseData.filter(Boolean);;
          this.total_references=this.referViewDetails.length;
        },
        (error) => {}
      )
  }
  showCountryCode(data){
    this.countryNames = data.country;
    this.countryCode = data.code;
    if(this.countryCode){
      this.hasCountrycode=true;
    }
  }
}

