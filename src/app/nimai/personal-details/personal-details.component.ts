import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { signup } from 'src/app/beans/signup';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import * as $ from '../../../assets/js/jquery.min';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { loads, selectpickercall } from '../../../assets/js/commons';
import { ValidateRegex } from '../../beans/Validations';
import { LoginService } from 'src/app/services/login/login.service';


const pd = this;
@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})

export class PersonalDetailsComponent implements OnInit {


  public loading = true;



  public personalDetailsForm: FormGroup;
  public personalDetails: signup = null;
  public isReferrer: boolean = false;
  public isBankCustomer: boolean = false;
  public isBankUnderwriter: boolean = false;
  public username: string = "";
  public submitted:boolean = false;

  interestedCountryList = this.countryService();
  blackListedGoodsList = this.goodsService();
  dropdownSetting = {};
  dropdownSettingGoods={};
  goodsArray: Array<string> = [];

  intCntTemp: any[] = [];
  goodsCntTemp:any[]=[];
  blgTemp: any[] = [];



  public title: string = "Personal Details";

  public parentURL: string = "";
  public subURL: string = "";
  public hasValue=false;
  resp: any;
  parentRedirection: string = "business-details";
  isBankOther: boolean=false;
  constructor(public activatedRoute: ActivatedRoute,public loginService: LoginService, public fb: FormBuilder, public router: Router, public personalDetailsService: PersonalDetailsService, public titleService: TitleService) {
    if(sessionStorage.getItem('userID'))
    {
      this.hasValue=true;
    }else{
      this.hasValue=false;
    }
    this.getPersonalDetails(sessionStorage.getItem('userID'));
    this.personalDetailsForm = this.fb.group({
      userId: [''],
      subscriberType: [''],
      bankType: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]],
      mobileNo: ['', [Validators.required,Validators.minLength(7)]],
      landLineNo: ['',Validators.minLength(7)],
      country: ['', Validators.required],
      companyName: [''],
      designation: [''],
      businessType: [''],
      countriesInt: [''],
      minLCVal: [''],
      regCurrency:[''],
      blacklistedGC: [''],
      otherTypeBank:[''],
      // otherEmails: this.fb.array([this.getOtherMails()])
      emailAddress1: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")],
      emailAddress2: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")],
      emailAddress3: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]

    })
    
    this.titleService.changeTitle(this.title);
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    }
    this.dropdownSettingGoods = {
      singleSelection: false,
      idField: 'id',
      textField: 'productCategory',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    }
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    let navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "MyProfile"){
        this.parentRedirection = "my-profile";
      }
    }

  }

  getOtherMails(){
    var count = 0;
    return this.fb.group({
      emailAddress: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]
  });
  }

  add(i: number) {
    let items = this.personalDetailsForm.get('otherEmails') as FormArray;
    if (items.length < 3)
    {
      items.push(this.getOtherMails());
    }
  }

  remove(i: number) {
    let items = this.personalDetailsForm.get('otherEmails') as FormArray;
    items.removeAt(i);
  }

  get perDetails() {
    return this.personalDetailsForm.controls;
  }

  ngOnInit() {
   // this.setUserCategoryValidators();
   this.goodsService();

    $("body").on("domChanged", function () {
      const inputs = $('.inputDiv').find('input');
      for (let input of inputs) {
        var text_val = $(input).val();
        if (text_val === "") {
          $(input).removeClass('has-value');
        } else {
          $(input).addClass('has-value');
        }
      };
    });

    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
  }
  setReferrerValidators(){
    this.personalDetailsForm.get('companyName').setValidators([Validators.required])
    this.personalDetailsForm.get('companyName').updateValueAndValidity();
    this.personalDetailsForm.get('businessType').setValidators([Validators.required])
    this.personalDetailsForm.get('businessType').updateValueAndValidity();
    this.personalDetailsForm.get('designation').setValidators([Validators.required])
    this.personalDetailsForm.get('designation').updateValueAndValidity();
  }
  setBankAsUnderwriterValidators(){
    this.personalDetailsForm.get('blacklistedGC').setValidators([Validators.required])
    this.personalDetailsForm.get('blacklistedGC').updateValueAndValidity();
    this.personalDetailsForm.get('countriesInt').setValidators([Validators.required])
    this.personalDetailsForm.get('countriesInt').updateValueAndValidity();
    this.personalDetailsForm.get('mobileNo').clearValidators();
    this.personalDetailsForm.get('mobileNo').updateValueAndValidity();
    this.personalDetailsForm.get('landLineNo').setValidators([Validators.required,Validators.minLength(7)])
    this.personalDetailsForm.get('landLineNo').updateValueAndValidity();
   }
   setBankAsCustomerValidators(){
    this.personalDetailsForm.get('mobileNo').clearValidators();
    this.personalDetailsForm.get('mobileNo').updateValueAndValidity();
    this.personalDetailsForm.get('landLineNo').setValidators([Validators.required,Validators.minLength(7)])
    this.personalDetailsForm.get('landLineNo').updateValueAndValidity();
    
   }
  submit(): void {
    // let items = this.personalDetailsForm.get('otherEmails') as FormArray;
    // console.log("items",items.controls)
    this.submitted = true;
   
    if(this.personalDetailsForm.invalid) {
      return;
    }
    this.submitted = false;
    this.titleService.loading.next(true);
    let userID = this.personalDetailsForm.get('userId').value;

    if (userID.startsWith('RE')) {
      this.parentRedirection = "kyc-details"
    }
    this.personalDetailsService.updatePersonalDetails(this.pdb(), userID)
      .subscribe(
        (response) => {
         this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congratulations! Your Personal Details has been successfully submitted!',
              message: '',
              parent: this.subURL + '/' + this.parentURL + '/' + this.parentRedirection  // need to check
            }
          };

          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/personal-details/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
           }); 
        },
        (error) => {
          this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: ' Your Personal Details has been failed !!!',
              message: 'Invalid Data',
              parent: this.subURL + "/" + this.parentURL + '/personal-details'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/personal-details/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )

  }

  public getPersonalDetails(userID: string) {

    this.titleService.loading.next(true);
    this.personalDetailsService.getPersonalDetails(userID)
      .subscribe(
        (response) => {
          let responseData = JSON.parse(JSON.stringify(response));
          this.personalDetails = responseData.data;
          this.username = this.personalDetails.firstName + " " + this.personalDetails.lastName;
          this.titleService.changeUserName(this.username);
          this.personalDetailsForm.patchValue({
            firstName: this.personalDetails.firstName,
            lastName: this.personalDetails.lastName,
            emailId: this.personalDetails.emailAddress,
            mobileNo: this.personalDetails.mobileNum,
            landLineNo: this.personalDetails.landLinenumber,
            country: this.personalDetails.countryName,
            companyName: this.personalDetails.companyName,
            designation: this.personalDetails.designation,
            businessType: this.personalDetails.businessType,
            userId: this.personalDetails.userId,
            subscriberType: this.personalDetails.subscriberType,
            bankType: this.personalDetails.bankType,
            countriesInt: this.filterInterestedCountry(this.personalDetails.interestedCountry),
            minLCVal: this.personalDetails.minLCValue,
            regCurrency:this.personalDetails.regCurrency,
            blacklistedGC: this.filterBlackListGoods(this.personalDetails.blacklistedGoods),
            emailAddress1: this.personalDetails.emailAddress1,
            emailAddress2: this.personalDetails.emailAddress2,
            emailAddress3: this.personalDetails.emailAddress3,

          })
          sessionStorage.setItem('custUserEmailId',this.personalDetails.emailAddress);
         if(this.personalDetails.interestedCountry)
         this.intCntTemp = this.filterDataINCT(this.personalDetails.interestedCountry);
         if(this.personalDetails.blacklistedGoods)
          this.blgTemp = this.filterDataBG(this.personalDetails.blacklistedGoods); 

          let subscriptionType = this.personalDetailsForm.get('subscriberType').value;
          let bankType = this.personalDetails.bankType
        
          if (subscriptionType === 'REFERRER') {
            this.isReferrer = true;
            this.isBankCustomer = false;
            this.isBankUnderwriter = false;
            this.setReferrerValidators();
          } else if ((subscriptionType === 'BANK' && bankType === 'UNDERWRITER')) {
            this.isBankUnderwriter = true;
            this.isBankCustomer = false;
            this.isReferrer = false;
            this.setBankAsUnderwriterValidators();
          }else if ((subscriptionType === 'BANK' && bankType === 'CUSTOMER')) {
            this.isBankCustomer = true;
            this.isBankUnderwriter = false;
            this.isReferrer = false;
            this.setBankAsCustomerValidators();
          } else {
            this.isBankUnderwriter = false;
            this.isBankCustomer = false;
            this.isReferrer = false;
          }
          setTimeout(() => {
            selectpickercall();
            loads();
            //$('.selectpicker').selectpicker('val', ['India', 'USA']);
          }, 200);

          const pd = this;
          setTimeout(function () {
            const inputs = $('.inputDiv').find('input');
            for (let input of inputs) {
              var text_val = $(input).val();
              if (text_val === "") {
                $(input).removeClass('has-value');
              } else {
                $(input).addClass('has-value');
              }
            };
            pd.loading = false;
          }, 1000)


          const selects = $('.inputDiv').find('select')

          for (let select of selects) {
            var text_val = $(select).val();
            if (text_val === "") {
              $(select).css('color', 'transparent');
              $(select).removeClass('has-value');
            } else {
              $(select).css('color', 'black');
              $(select).addClass('has-value');
            }
          };

          this.titleService.loading.next(false);

        },
        (error) => {
          this.titleService.loading.next(false);
          this.personalDetails = null;
        }
      )
  }
  filterDataBG(blacklistedGoods: import("../../beans/blacklistedgoods").BlackListedGoods[]): any[] {
    var data:any[]=[];
    for(var acdata of blacklistedGoods){
      if(acdata.blackListGoods){
      var d={
        id:acdata.goodsMId,
        productCategory:acdata.blackListGoods
      }
      data.push(d);
    }
    }
    return data;
  }
  filterDataINCT(interestedCountry: import("../../beans/interestedcountry").InterestedCountry[]): any[] {
    var data:any[]=[];
    for(var acdata of interestedCountry){
      if(acdata.countriesIntrested){
      var d={
        id:acdata.ccid,
        name:acdata.countriesIntrested
      }
      data.push(d);
    }
    }
    return data;
  }
  public pdb(): signup {
    let data = {
      subscriberType: this.personalDetailsForm.get('subscriberType').value,
      firstName: this.personalDetailsForm.get('firstName').value,
      lastName: this.personalDetailsForm.get('lastName').value,
      emailAddress: this.personalDetailsForm.get('emailId').value,
      mobileNum: this.personalDetailsForm.get('mobileNo').value,
      countryName: this.personalDetailsForm.get('country').value,
      landLinenumber: this.personalDetailsForm.get('landLineNo').value,
      companyName: this.personalDetailsForm.get('companyName').value,
      designation: this.personalDetailsForm.get('designation').value,
      businessType: this.personalDetailsForm.get('businessType').value,
      userId: this.personalDetailsForm.get('userId').value,
      bankType: this.personalDetailsForm.get('bankType').value,
      minLCValue: this.personalDetailsForm.get('minLCVal').value,
      regCurrency:this.personalDetailsForm.get('regCurrency').value,
      interestedCountry: this.filterForSaveIntCon(this.intCntTemp),
      blacklistedGoods: this.filterForSaveBlg(this.blgTemp),
      emailAddress1: this.personalDetailsForm.get('emailAddress1').value,
      emailAddress2: this.personalDetailsForm.get('emailAddress2').value,
      emailAddress3: this.personalDetailsForm.get('emailAddress3').value,

    }
    return data;
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


  // goodsService() {
  //   return [{ id: 0, name: 'None' },{ id: 1, name: 'Gold' }, { id: 2, name: 'Drugs' }, { id: 3, name: 'Diamonds' }]
  // }


  // getGoodsName(gid: number) {
  //   return this.goodsService().filter((res) => res.id == gid)[0];
  // }

  countryService() {
    return [{ id: 1, name: 'India' }, { id: 2, name: 'USA' }, { id: 3, name: 'Australia' }]
  }


  getCountryName(ccid: number) {
    return this.countryService().filter((res) => res.id == ccid)[0];
  }
  onItemSelect(item: any) {
    //this.intCntTemp.push(item);
     console.log(this.intCntTemp);
    // console.log(this.filterForSaveIntCon(this.intCntTemp, this.personalDetailsForm.get('countriesInt').value))
    // console.log(this.filterForSaveBlg(this.blgTemp, this.personalDetailsForm.get('blacklistedGC').value))
  }

  onSelectAll(item: any) {
    console.log(this.intCntTemp);
    //this.intCntTemp=item;
  }
  onItemDeSelect(item:any){
    console.log(this.intCntTemp)
    // const index: number = this.intCntTemp.indexOf(item);
    // if (index !== -1) {
    //     this.intCntTemp.splice(index, 1);
    // } 
  }

  onItemSelectBG(item: any) {
    if(item.productCategory=="Others"){
      this.isBankOther=true;      
     // loads();
    }else{
      this.isBankOther=false;
    }

    if(item.id === 0){
     this.blgTemp=[];
     this.blgTemp.push(item)
    }
     console.log( this.blgTemp);
    // console.log(this.filterForSaveIntCon(this.intCntTemp, this.personalDetailsForm.get('countriesInt').value))
    // console.log(this.filterForSaveBlg(this.blgTemp, this.personalDetailsForm.get('blacklistedGC').value))
  }

  onSelectAllBG(item: any) {
    console.log(this.blgTemp);
   // this.blgTemp=item;
  }
  onItemDeSelectBG(item:any){
    console.log(this.blgTemp)
    // const index: number = this.blgTemp.indexOf(item);
    // if (index !== -1) {
    //     this.blgTemp.splice(index, 1);
    // } 
  }
  
 


  filterInterestedCountry(data: any[]) {
    let dataArr: any[] = [];

    if (data != null){
      for (let d of data) {
        let dd = {
          id: d.ccid,
          name: d.countriesIntrested
        }
        dataArr.push(dd);
      }
    }else{

    }
    return dataArr;

  }


  filterBlackListGoods(data: any[]) {
    let dataArr: any[] = [];
    if (data != null)
      for (let d of data) {
        let dd = {
          id: d.goodsMId,
          productCategory: d.blackListGoods
        }
        dataArr.push(dd);
      }
    return dataArr;

  }


  filterForSaveIntCon(data: any[]) {
    
    let dataArr: any[] = [];
    for (let d1 of data) {

      
        let dd = {
          countryID: null,
          countriesIntrested: d1.name,
          ccid: d1.id
        }
        dataArr.push(dd)
      


    }
    return dataArr;

  }



  filterForSaveBlg(data: any[]) {
    let dataArr: any[] = [];
    for (let d1 of data) {
      let dd
      if(d1.productCategory == 'Others'){
        var bankothers= this.personalDetailsForm.get('otherTypeBank').value;
         dd = {
          goods_ID: null,
          blackListGoods: "Others - "+bankothers,
          goodsMId: d1.id
        }
     }else{
       dd = {
        goods_ID: null,
        blackListGoods: d1.productCategory,
        goodsMId: d1.id
      }
    }
       
        dataArr.push(dd)
      


    }
    return dataArr;
  }
  validateRegexFields(event, type) {
    if (type == "number") {
      ValidateRegex.validateNumber(event);
    }
    else if (type == "alpha") {
      ValidateRegex.alphaOnly(event);
    }
    else if (type == "alphaNum") {
      ValidateRegex.alphaNumeric(event);
    }else if(type=="name_validation"){
      var key = event.keyCode;
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/)) {
          event.preventDefault();
      }    
    }
  }


}
