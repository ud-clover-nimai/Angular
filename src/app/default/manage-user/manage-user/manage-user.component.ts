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


@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {

  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  respMessage: any;
  resp: any;
  interestedCountryList = this.countryService();
  blackListedGoodsList = this.goodsService();
  dropdownSetting = {};
  public intCountries: InterestedCountry[] = [];
  public blg: BlackListedGoods[] = [];
  public intCountriesValue: any[] = [];
  public blgValue: any[] = [];



  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ResetPasswordService, public signUpService: SignupService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));

    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: false
    }

  }

  manageSubForm = this.formBuilder.group({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    mobileNo: new FormControl(''),
    country: new FormControl('',[Validators.required]),
    landlineNo: new FormControl('',[Validators.required]),
    emailId: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    countriesInt: new FormControl('',[Validators.required]),
    minLCValue: new FormControl(''),
    blacklistedGC: new FormControl('',[Validators.required]),
  });

  get manageSubDetails() {
    return this.manageSubForm.controls;
  }

  goodsService() {
    return [{ id: 1, name: 'Gold' }, { id: 2, name: 'Drugs' }, { id: 3, name: 'Diamonds' }]
  }


  getGoodsName(gid: number) {
    return this.goodsService().filter((res) => res.id == gid)[0];
  }

  countryService() {
    return [{ id: 1, name: 'India' }, { id: 2, name: 'USA' }, { id: 3, name: 'Australia' }]
  }


  getCountryName(ccid: number) {
    return this.countryService().filter((res) => res.id == ccid)[0];
  }

  onItemSelect(item: any) {
    console.log(item);

  }

  onSelectAll(item: any) {
    console.log(item);
  }

  ngOnInit() {
    loads();
    manageSub();
  }

  close() {
    // this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
    $("#addsub").hide();
  }

  onOkClick(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-user`]);
      });
      $("#addsub").hide();
  }

  addSubsidiary() {
    $("#addsub").show();
    this.manageSubForm.reset();
  }

  onSubmit() {

    this.blgValue = this.manageSubForm.get('blacklistedGC').value;
    this.intCountriesValue = this.manageSubForm.get('countriesInt').value;
    console.log(this.intCountriesValue+"========"+this.blgValue);
    
    this.blg = [];
    this.intCountries = [];

    for (let vlg of this.blgValue) {
      let blgData = {
        goods_ID: null,
        goodsMId: vlg.id,
        blackListGoods: vlg.name
      }
      this.blg.push(blgData);
    }

    for (let icc of this.intCountriesValue) {
      let icData = {
        countryID: null,
        ccid: icc.id,
        countriesIntrested: icc.name
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
      countryName: this.manageSubForm.get('country').value,
      landLinenumber: this.manageSubForm.get('landlineNo').value,
      companyName: '',
      designation: '',
      businessType: '',
      userId: "",
      bankType: "underwriter",
      subscriberType: "bank",

      minLCValue: minValue,
      interestedCountry: this.intCountries,
      blacklistedGoods: [],
      account_source: sessionStorage.getItem('userID'),
      account_type: "BANKUSER",
      account_status: "ACTIVE",
      account_created_date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
      regCurrency: "",
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: ""

    }

    this.submitted = true;
    if (this.manageSubForm.invalid) {
      return;
    }
    this.submitted = false;
    const fg = {
      event: 'ACCOUNT_ACTIVATE',
      email: this.manageSubForm.get('emailId').value,
    }
    this.signUpService.signUp(data).subscribe((response) => {
      this.respMessage = JSON.parse(JSON.stringify(response)).message;
    this.fps.sendRegistrationEmail(fg)
      .subscribe(
        (response) => {
          this.respMessage = JSON.parse(JSON.stringify(response)).message;
          
          if(this.respMessage.indexOf('not match') > -1){
            this.respMessage = "Domain Name does not match!"
          }
          else{
            this.respMessage = "You've been successfully invited as a user for " + "Clover Infotech" + " to join TradeEnabler."
            
          }
          $('#authemaildiv').slideUp();
          $('#paradiv').slideDown();
          $('#okbtn').show();
          $('#btninvite').hide();
          this.manageSubForm.reset();
        },
        (error) => {
          $('#authemaildiv').slideUp();
          $('#paradiv').slideDown();
          $('#okbtn').show();
          $('#btninvite').hide();
          this.manageSubForm.reset();
          this.respMessage = "Service not working! Please try again later."
        }
      )
    },
    (err) =>{
      $('#authemaildiv').slideUp();
          $('#paradiv').slideDown();
          $('#okbtn').show();
          $('#btninvite').hide();
          this.manageSubForm.reset();
      this.respMessage = JSON.parse(JSON.stringify(err.error)).errMessage;
    }
    )
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
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/)) {
          event.preventDefault();
      }    
    }
  }

}

