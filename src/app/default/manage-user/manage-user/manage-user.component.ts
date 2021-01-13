import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from 'src/assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { loads } from 'src/assets/js/commons';
import { formatDate } from '@angular/common';
import { SignupService } from 'src/app/services/signup/signup.service';
import { InterestedCountry } from 'src/app/beans/interestedcountry';
import { BlackListedGoods } from 'src/app/beans/blacklistedgoods';
import { ValidateRegex } from 'src/app/beans/Validations';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { DashboardDetailsService } from 'src/app/services/dashboard-details/dashboard-details.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  userData:any;
  noData:any;
  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  respMessage: any;
  resp: any;

  dropdownSetting = {};
  public intCountries: InterestedCountry[] = [];
  public blg: BlackListedGoods[] = [];
  public intCountriesValue: any[] = [];
  public blgValue: any[] = [];
  subsidiries:any;
  subuticount:any;
  available:any;
  countryCode: any=" ";
  hasCountrycode: boolean=false;
  dropdownSettingGoods={};
  goodsArray: Array<string> = [];
  countryArray: Array<string> = [];
  isBankOther: boolean;
  countryName: any;
    constructor(public router: Router, public loginService: LoginService,public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ResetPasswordService, public signUpService: SignupService,public service: DashboardDetailsService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

   
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'code',
      textField: 'country',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.dropdownSettingGoods = {
      singleSelection: false,
      idField: 'id',
      textField: 'productCategory',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }

  }

  manageSubForm = this.formBuilder.group({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    country: new FormControl('',[Validators.required]),
    mobileNo: new FormControl('',[Validators.minLength(7)]),
    landlineNo: new FormControl('',[Validators.required, Validators.minLength(7)]),
    emailId: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]),
    countriesInt: new FormControl('',[Validators.required]),
    minLCValue: new FormControl(''),
    regCurrency: new FormControl(''),
    blacklistedGC: new FormControl('',[Validators.required]),
    otherTypeBank:new FormControl(''),

  });

  get manageSubDetails() {
    return this.manageSubForm.controls;
  }

 


  onItemSelect(item: any) {
    if(item.productCategory=="Others"){
      this.isBankOther=true;      
     // loads();
    }else{
      this.isBankOther=false;
    }
  }

  onSelectAll(item: any) {
    console.log(item);
  }

  ngOnInit() {
    this.goodsService();

    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
    this.subsidiries=sessionStorage.getItem('subsidiries');  
    this.subuticount=sessionStorage.getItem('subuticount');
    this.available=this.subsidiries-this.subuticount
    loads();
    manageSub();
    this.listOfUsers();
  }
  goodsService() {
    this.loginService.getGoodsData().
      subscribe(
        (response) => {
          this.goodsArray = JSON.parse(JSON.stringify(response));
        },
        (error) => {}
      )
}
  listOfUsers(){
    const param = {
      userid:sessionStorage.getItem('userID'),    
    }
    this.service.getUserList(param).subscribe(
      (response) => {
        if(JSON.parse(JSON.stringify(response)).data)
          this.userData = JSON.parse(JSON.stringify(response)).data;
        else
          this.userData=""  
        if(this.userData.length === 0){
          this.noData = true;
        }else{
          this.noData=false;
        }
       
      },(error) =>{
        this.noData = true;
      }
      )
  }
  close() {
    // this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
    $("#addsub").hide();
  }

  onOkClick(){
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //       this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-user`]);
    //   });
    window.location.reload();
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
    this.blgValue = this.manageSubForm.get('blacklistedGC').value;
    this.intCountriesValue = this.manageSubForm.get('countriesInt').value;
    this.blg = [];
    this.intCountries = [];
    for (let vlg of this.blgValue) {
      let blgData;
      if(vlg.productCategory == 'Others'){
         var bankothers= this.manageSubForm.get('otherTypeBank').value;
           blgData = {
            goods_ID: null,
            goodsMId: vlg.id,
            blackListGoods:"Others - "+bankothers,
          }
      }else{
         blgData = {
          goods_ID: null,
          goodsMId: vlg.id,
          blackListGoods: vlg.productCategory
        }
      }
     
     
      this.blg.push(blgData);
    }

    for (let icc of this.intCountriesValue) {
      let icData = {
        countryID: null,
        ccid: icc.code,
        countriesIntrested: icc.country
      }
      this.intCountries.push(icData);
    }

    var minValue = this.manageSubForm.get('minLCValue').value;
    if(minValue == ""){
      minValue = '0';
    }

    let data = {

      firstName: this.manageSubForm.get('firstName').value,
      lastName: this.manageSubForm.get('lastName').value,
      emailAddress: this.manageSubForm.get('emailId').value,
      mobileNum: this.manageSubForm.get('mobileNo').value,
      countryName: this.countryName,
      landLinenumber: this.manageSubForm.get('landlineNo').value,
      companyName: '',
      designation: '',
      businessType: '',
      userId: "",
      bankType: "underwriter",
      subscriberType: "bank",
      minLCValue: minValue,
      interestedCountry: this.intCountries,
      blacklistedGoods: this.blg,
      account_source: sessionStorage.getItem('userID'),
      account_type: "BANKUSER",
      account_status: "ACTIVE",
      account_created_date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
      regCurrency: "",
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: ""

    }

   
    const fg = {
      event: 'ACCOUNT_ACTIVATE',
      email: this.manageSubForm.get('emailId').value,
    }
    this.signUpService.signUp(data).subscribe((response) => {
      this.respMessage = JSON.parse(JSON.stringify(response)).message;
      let res= JSON.parse(JSON.stringify(response))
      if(res.status!=="Failure"){
        this.fps.sendRegistrationEmail(fg)
        .subscribe(
          (response) => {
            this.resetPopup();
            this.respMessage = "You've successfully invited an additional user to join NimaiTrade. You will be notified once the invitee completes the sign up process."
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
     console.log("error--",error)
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
  showCountryCode(data){
    this.countryName = data.country;
    this.countryCode = data.code;
    if(this.countryCode){
      this.hasCountrycode=true;
    }
  }
}

