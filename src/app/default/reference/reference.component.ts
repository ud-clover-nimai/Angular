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
import {removeDoubleScroll} from 'src/assets/js/commons'
import { SignupService } from 'src/app/services/signup/signup.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit {

  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  CompanyName: any;
  getCurrentDate: any;
  showBranchUserId: boolean = false;
  resp: any;
  
  date: Date = null;
  referViewDetails : any;
  respMessage: string;
  total_references:number;
  total_earning:number;
  responseData: any;
  isActiveRefer: boolean=false;
  data: any="";
  public detailInfo: string = "";
  userRId: string="";
  expiration_date: number;
  
  constructor(public titleService: TitleService,public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ForgetPasswordService, public service:ReferService, public signUpService: SignupService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.getCurrentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en'); 

    if(sessionStorage.getItem('userID').startsWith('BC')){
      this.showBranchUserId = true;
    }
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));

  }

  referForm = this.formBuilder.group({
    userId: sessionStorage.getItem('userID'),
    // referenceId: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobileNo: ['', [Validators.required]],
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
    loads();

    this.total_earning=0;
    this.viewReferDetails(sessionStorage.getItem('userID'));
    
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
  }



  close() {
    $("#addsubref").hide();
    this.referForm.reset();
  }
  close_details(){
    $("#referDetail").hide();
  }
  close_successmsg(){
    $("#successResend1").hide();
  }
  onOkClick(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/reference`]);
      });
      $("#addsubref").hide();
  }

  addRefer() {
    $("#addsubref").show();
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
      emailAddress: this.referForm.get('emailAddress').value,
      countryName: this.referForm.get('countryName').value,
      companyName: this.referForm.get('companyName').value,
      status: 'ACTIVE',
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
      countryName: this.referForm.get('countryName').value,
      landLinenumber: "",
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
                this.respMessage = "You've successfully invited a corporate to join NIMAITRADE. You will be notified once corporate completes the signup processes."
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
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/)) {
          event.preventDefault();
      }    
    }else if(type=="mobile_number"){
      if (key!= 43 && key > 31 && (key < 48 || key > 57)) {
        event.preventDefault();
    }
    }
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}
  viewReferDetails(userID: string) {
    this.service.getRegisterUsers(userID)
      .subscribe(
        (response) => {
          this.responseData = JSON.parse(JSON.stringify(response));
        //   let uu=this.responseData[0].insertedDate;
        //   this.expiration_date = Date.parse(this.responseData[0].insertedDate.value);
        //   let formatedDate = formatDate(new Date(uu), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');
        //  // this.date = parse(formatedDate, 'd/M/yyyy HH:mm:ss', new Date());
      
        //   Date date=this.expiration_date;
      
        // let test1= this.date.setDate( this.date.getDate() + 1 );
        // this.date = new Date(test1);
        // console.log(this.date)

        // let test2= this.date.setDate( this.date.getDate());
        // this.date = new Date(test2);
        // console.log(this.date)

// console.log(test2)

          manageSub();

          //let total = 0;
          // for (let i = 0; i < responseData.length; i++) {
          //   console.log ("Block statement execution no." + responseData[i].earnings);
          //   total +=Number(responseData[i].earnings);
          // }
          // this.total_earning=total;
          // this.referViewDetails = responseData.filter(Boolean);;
          // this.total_references=this.referViewDetails.length;
        },
        (error) => {}
      )
  }
  openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";
  }
  closeOffcanvas() {
    document.getElementById("referDetail").style.width = "0%";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  }
  openOffcanvas() {
      document.getElementById("referDetail").style.width = "600px";
  
  } 
  showDetail(data: any) {
      this.isActiveRefer = true;
    this.titleService.quote.next(true);
    removeDoubleScroll()
  
    this.service.getRegisterUserByUserId(data.userid).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response));
        this.data = this.detailInfo[0];

        // this.viewData=this.detailInfo;
        // if(this.viewData.lcProForma==null || this.viewData.lcProForma=="" || this.viewData.lcProForma==undefined){
        //   this.noFileDisable=false;
        //   this.viewDisable=true;
    
        //  }else{
        //   this.viewDisable=false;
        //   this.noFileDisable=true;
        //  }
      }, (error) => {
        //this.hasNoRecord = true;
      }
    )

  }
  resend(data){
    this.userRId=data.userid;
    $('#successResend').show();
    
    }

    closeResend(){
      $('#successResend').hide();
    }
  
successResend(){
  const param = {
    "emailId": sessionStorage.getItem('custUserEmailId'),
    "event": 'ADD_REFER',
    "userId": this.userRId,
    "referenceId":""
  }
  console.log(param);
  
  this.fps.sendEmailReferSubsidiary(param).subscribe((response)=>{
    if(response.message=='Email Send Succefully'){
 $('#successResend').hide();
 $('#successResend1').show();

    }
  })
}
}

