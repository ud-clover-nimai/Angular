import { Component, OnInit, Inject ,ElementRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';
import { SignupService } from 'src/app/services/signup/signup.service';
import { signup } from 'src/app/beans/signup';
import { Login } from 'src/app/beans/login';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, NavigationExtras } from '@angular/router';
import * as $ from '../../../assets/js/jquery.min';
import { loads, selectpickercall, loadLogin } from '../../../assets/js/commons';
import { InterestedCountry } from 'src/app/beans/interestedcountry';
import { BlackListedGoods } from 'src/app/beans/blacklistedgoods';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { Email } from 'src/app/beans/Email';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import  { ValidateRegex } from 'src/app/beans/Validations';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material';
import { TermAndConditionsComponent } from '../term-and-conditions/term-and-conditions.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public signupForm: FormGroup;
  public forgotPasswordForm: FormGroup;
  public isBank = false;
  public isReferrer = false;

  public intCountries: InterestedCountry[] = [];
  public blg: BlackListedGoods[] = [];
  public intCountriesValue: any[] = [];
  public blgValue: any[] = [];
  interestedCountryList = this.countryService();
  blackListedGoodsList = this.goodsService();
  dropdownSetting = {};
  public hasCountrycode=false;
  public submitted = false;
  public submittedSignup = false;
  public forgPassSubmitted: boolean = false;
  resp: any;
  isTextFieldType: boolean;
  todaysDate: any;
  countryCode: any = "";
  countryName: any;
  
  constructor(public fb: FormBuilder, public router: Router, public rsc: ResetPasswordService, public fps: ForgetPasswordService, public signUpService: SignupService, public loginService: LoginService,private el: ElementRef,public dialog: MatDialog, public titleService: TitleService) {
   // $('#checkboxError').hide();
  }

  ngOnInit() {
    loads();
    loadLogin();
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });

    this.signupForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      officialMailId: [''],
      mobileNo: [''],
      landlineNo: [''],
      country: [''],
      designation: [''],
      businessType: [''],
      radio: ['customer'],
      selector: ['customer'],
      countriesInt: [''],
      minLCValue: ['0'],
      blacklistedGC: [''],
      companyName: [''],
      termsAndcondition: ['', Validators.requiredTrue],
      regCurrency:['']
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    })
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: false
    }
    this.getCountryData();
  }

  ngAfterViewInit() {     
    const first_input = this.el.nativeElement.querySelector('.first_input');
    first_input.focus();
    const inputList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('input'));
    
    inputList.forEach((input: HTMLElement) => {
        input.addEventListener('focus', () => {
         if((<HTMLInputElement>event.target).id===null || (<HTMLInputElement>event.target).id===""){
            if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
             input.className="ng-valid ng-dirty ng-touched"   
            else 
             input.className="ng-valid ng-dirty ng-touched has-value"
         }   
        });
           input.addEventListener('blur', () => {
             if((<HTMLInputElement>event.target).id===null || (<HTMLInputElement>event.target).id==="")
             {
             if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
               input.className="ng-valid ng-dirty ng-touched"   
             else
             input.className="ng-valid ng-dirty ng-touched has-value"
             }
        });
    });
  }
  get lf() {
    return this.loginForm.controls;
  }
  get suf() {
    return this.signupForm.controls;
  }
  get fpf() {
    return this.forgotPasswordForm.controls;
  }
  submit() {
    this.submitted = true;
    this.validate();
    if (this.loginForm.invalid) {
      return;
    }
    this.submitted = false;
    let loginData: Login = {
      userId: this.loginForm.get('username').value.trim(),
      password: this.loginForm.get('password').value
    }
    this.loginForm.get('username').setValue(this.loginForm.get('username').value.trim())
    this.loginService.login(loginData).
      subscribe(
        (response) => {
          this.Removevalidate();
          let responseData = JSON.parse(JSON.stringify(response));
          sessionStorage.setItem('userID', loginData.userId);
          this.titleService.loading.next(true);
          if (loginData.userId.startsWith('RE')) {
            this.router.navigate(['/ref/rcs/dashboard-details']);
          } else  if (loginData.userId.startsWith('BA')){
            this.router.navigate(['/bcst/dsb/dashboard-details']);       
          } else if(loginData.userId.startsWith('CU')){
             this.router.navigate(['/cst/dsb/dashboard-details']); 
          }   else if(loginData.userId.startsWith('BC')){
             this.callCustomerPopup();  
           
          }

        },
        (error) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'User ID or Password is incorrect!',
              message: '',
              parent: 'login'
            }
          };
          this.router.navigate(['/login/error'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
           // this.resetLoginForm();
        }
      )
  }

  signUp() {
    var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
    var isChecked = element.checked;
    //$('#checkboxError').hide();
    this.submittedSignup = true;
    let subscriptionType = this.signupForm.get('radio').value;
    let selector = this.signupForm.get('selector').value;
    if (subscriptionType == 'referrer') {
      this.validateCommons();
      this.validateReferrerForm();
      if (this.signupForm.invalid) {
        return;
      }
    } else {
      if (subscriptionType == 'bank' && selector == 'underwriter') {
        this.validateCommons();
        this.validateBank();        
        if (this.signupForm.invalid) {
          return;
        }
      }else if((subscriptionType == 'bank' && selector == 'customer')){
        this.validateBankAsCustomer();
        if (this.signupForm.invalid) {
          return;
        }
      } else {
        this.validateCommons();
        if (this.signupForm.invalid) {
          return;
        }
      }

    }
    // if(!isChecked){
    // $('#checkboxError').show();
    //   return;
    // }

    this.signUpService.signUp(this.signUpForm()).subscribe((response) => {

      let res = JSON.parse(JSON.stringify(response)).data;
      let emailResetPassworData: Email = {
        event: 'ACCOUNT_ACTIVATE',
        email: res.emailAddress
      }
      let saveResponse = JSON.parse(JSON.stringify(response)).errMessage;
      this.rsc.sendRegistrationEmail(emailResetPassworData).
        subscribe(
          (response) => {
            this.resetSignUpForm();
            this.signupForm.patchValue({ radio: 'customer', selector: 'customer' })
            this.submittedSignup = false;
            this.clearSignupValidation();
            this.updateValidation();
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Congratulations! Your account has been successfully created!',
                message: 'Soon you will receive login credentials on your registered email address '+res.emailAddress+' to securely activate your account. Kindly follow the instructions mentioned in the email to proceed further.',
                parent: 'login'
              }
            };
            this.router.navigate(['/login/success'], navigationExtras)
              .then(success => console.log('navigation success?', success))
              .catch(console.error);
          },
          (error) => {
            const navigationExtras: NavigationExtras = {
              state: {
                title: JSON.parse(JSON.stringify(error)).error.errMessage,
                message: '',
                parent: 'login'
              }
            };
            this.router.navigate(['/login/error'], navigationExtras)
              .then(success => console.log('navigation success?', success))
              .catch(console.error);
          }
        )

    },
      error => {
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'login'
          }
        };
        this.router.navigate(['/login/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);

      })
    
  }

  public sugnUpView() {
    this.hasCountrycode=false;
    this.clearSignupValidation();
    this.updateValidation();
    this.resetLoginForm();
  }
  public checkUserType(value: string) {
    this.hasCountrycode=false;
    $('#checkboxError').hide();  
    this.clearSignupValidation();
    this.updateValidation();
    if (value === 'customer') {
      this.isBank = false;
      this.isReferrer = false;
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'customer' })
    } else if (value === 'bank') {
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'bank', selector: 'customer' })
      this.isBank = false;
      this.isReferrer = false;
      setTimeout(function () { loads() }, 100);
    } else {
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'referrer' })
      this.isBank = false;
      this.isReferrer = true;
      // this.signupForm.reset();
      setTimeout(function () { loads() }, 100)
    }
  }
  bankAsEvent(value: string) {
    this.hasCountrycode=false;
    this.clearSignupValidation();
    this.updateValidation();
    if (value === 'c') {
      this.isBank = false;
      this.isReferrer = false;
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'bank', selector: 'customer' })

    } else {
      this.isBank = true;
      this.resetSignUpForm();
      this.signupForm.patchValue({ radio: 'bank', selector: 'underwriter' })
      setTimeout(function () { loads() }, 200);
      setTimeout(function () { selectpickercall() }, 200);
    }

  }

  togglePasswordFieldType(){
    this.isTextFieldType = !this.isTextFieldType;
  }

  forgotPassword(): void {
    this.forgPassSubmitted = true;
    this.forPassValidate();
    if(this.forgotPasswordForm.invalid){
      return;
    }
    this.forgPassSubmitted = false;

    const fg ={
      email:this.forgotPasswordForm.get('email').value,
      event:'FORGOT_PASSWORD'
    }
    this.fps.sendForgetPasswordEmail(fg)
      .subscribe(
        (response) => {
          let emailValue = this.forgotPasswordForm.get('email').value;
          $('#ForgotPassworddiv').slideUp();
          $('#logindiv').slideDown();
          this.forgotPasswordForm.reset();
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congratulations! Password reset link is sent to email id '+ emailValue,
              message: '',
              parent: 'login'
            }
          };
          this.router.navigate(['/login/success'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        },
        (error) => {
          let responserror = JSON.parse(JSON.stringify(error));
          console.log(responserror)
          const navigationExtras: NavigationExtras = {
            state: {
              title: responserror.error.message,
              message: '',
              parent: 'login'
            }

          };
          this.router.navigate(['/login/error'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )

  }
  validateBankAsCustomer(){
    $('#checkboxError').show();
    this.signupForm.get('firstName').setValidators(Validators.required);
    this.signupForm.get('lastName').setValidators(Validators.required);
    this.signupForm.get('officialMailId').setValidators([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
    this.signupForm.get('mobileNo').clearValidators();
    this.signupForm.get('country').setValidators(Validators.required);
    this.signupForm.get('landlineNo').setValidators([Validators.required,Validators.minLength(7)]);
    this.removeBankValidation();
    this.removeReferrerValidation();
    this.updateValidation();
  }
  validateCommons() {
    $('#checkboxError').show();
    this.signupForm.get('firstName').setValidators(Validators.required);
    this.signupForm.get('lastName').setValidators(Validators.required);
    this.signupForm.get('officialMailId').setValidators([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
    this.signupForm.get('mobileNo').setValidators([Validators.required,Validators.minLength(7)]);
    this.signupForm.get('country').setValidators(Validators.required);
    this.signupForm.get('landlineNo').setValidators(Validators.minLength(7));
    this.removeBankValidation();
    this.removeReferrerValidation();
    this.updateValidation();
  }

  validateBank() {
    // this.signupForm.get('minLCValue').setValidators(Validators.required);
    $('#checkboxError').show();
    this.signupForm.get('blacklistedGC').setValidators(Validators.required);
    this.signupForm.get('countriesInt').setValidators(Validators.required);
    this.signupForm.get('mobileNo').clearValidators();
    this.signupForm.get('landlineNo').setValidators([Validators.required,Validators.minLength(7)]);
    this.updateValidation();
  }


  removeReferrerValidation() {
    this.signupForm.get('designation').clearValidators();
    this.signupForm.get('companyName').clearValidators();
    this.signupForm.get('businessType').clearValidators();
    this.updateValidation();

  }e
  validateReferrerForm() {
    $('#checkboxError').show();
    this.signupForm.get('designation').setValidators(Validators.required);
    this.signupForm.get('companyName').setValidators(Validators.required);
    this.signupForm.get('businessType').setValidators(Validators.required);
    this.updateValidation();

  }
  openTermAndServiceDialog(title): void {
    const dialogRef = this.dialog.open(TermAndConditionsComponent, {
      height: '90%',
      width: '88%',
      data: { title: title },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  removeBankValidation() {
    this.signupForm.get('minLCValue').clearValidators();
    this.signupForm.get('blacklistedGC').clearValidators();
    this.signupForm.get('countriesInt').clearValidators();
    this.updateValidation();
  }

  clearSignupValidation() {
    this.signupForm.get('designation').clearValidators();
    this.signupForm.get('companyName').clearValidators();
    this.signupForm.get('businessType').clearValidators();

    this.signupForm.get('minLCValue').clearValidators();
    this.signupForm.get('blacklistedGC').clearValidators();
    this.signupForm.get('countriesInt').clearValidators();

    this.signupForm.get('firstName').clearValidators();
    this.signupForm.get('lastName').clearValidators();
    this.signupForm.get('officialMailId').clearValidators();
    this.signupForm.get('mobileNo').clearValidators();
    this.signupForm.get('landlineNo').clearValidators();
    this.signupForm.get('country').clearValidators();
    $("#checkboxError").hide();
  }

  updateValidation() {
    this.signupForm.get('designation').updateValueAndValidity();
    this.signupForm.get('companyName').updateValueAndValidity();
    this.signupForm.get('businessType').updateValueAndValidity();

    this.signupForm.get('minLCValue').updateValueAndValidity();
    this.signupForm.get('blacklistedGC').updateValueAndValidity();
    this.signupForm.get('countriesInt').updateValueAndValidity();

    this.signupForm.get('firstName').updateValueAndValidity();
    this.signupForm.get('lastName').updateValueAndValidity();
    this.signupForm.get('officialMailId').updateValueAndValidity();
    this.signupForm.get('mobileNo').updateValueAndValidity();
    this.signupForm.get('landlineNo').updateValueAndValidity();
    this.signupForm.get('country').updateValueAndValidity();
  }



  public signUpForm(): signup {

    this.blgValue = this.signupForm.get('blacklistedGC').value;
    this.intCountriesValue = this.signupForm.get('countriesInt').value;
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
    var minValue = this.signupForm.get('minLCValue').value;
    if(minValue == ""){
      minValue = '0';
    }
    this.todaysDate = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');


    let data = {

      firstName: this.signupForm.get('firstName').value,
      lastName: this.signupForm.get('lastName').value,
      emailAddress: this.signupForm.get('officialMailId').value,
      mobileNum: this.countryCode+this.signupForm.get('mobileNo').value,
      countryName: this.countryName,
      landLinenumber: this.signupForm.get('landlineNo').value,
      companyName: this.signupForm.get('companyName').value,
      designation: this.signupForm.get('designation').value,
      businessType: this.signupForm.get('businessType').value,
      userId: "",
      bankType: this.signupForm.get('selector').value,
      subscriberType: this.signupForm.get('radio').value,

      minLCValue: minValue,
      interestedCountry: this.intCountries,
      blacklistedGoods: this.blg,
      account_source: "WEBSITE",
      account_type: "MASTER",
      account_status: "ACTIVE",
      account_created_date: this.todaysDate,
      regCurrency: this.signupForm.get('regCurrency').value,
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: ""

    }
    return data;
  }


  goodsService() {
    return [{ id: 0, name: 'None' },{ id: 1, name: 'Gold' }, { id: 2, name: 'Drugs' }, { id: 3, name: 'Diamonds' }]
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

  resetLoginForm() {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  resetSignUpForm() {
    this.signupForm.patchValue({
      firstName: '',
      lastName: '',
      officialMailId: '',
      mobileNo: '',
      landlineNo: '',
      country: '',
      designation: '',
      businessType: '',
      radio: '',
      selector: '',
      countriesInt: '',
      minLCValue: '',
      blacklistedGC: '',
      companyName: '',
      regCurrency:''
    })
    $("#isCheckedForTerms"). prop("checked", false);
  }


  validate() {
    this.loginForm.get('username').setValidators(Validators.required);
    this.loginForm.get('password').setValidators(Validators.required);
    this.loginForm.get('username').updateValueAndValidity();
    this.loginForm.get('password').updateValueAndValidity();
  }

  Removevalidate() {
    this.loginForm.get('username').clearValidators();
    this.loginForm.get('password').clearValidators();
    this.loginForm.get('username').updateValueAndValidity();
    this.loginForm.get('password').updateValueAndValidity();
  }


  validateRegexFields(event, type){
    var key = event.keyCode;
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }else if(type=="name_validation"){
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/)) {
          event.preventDefault();
      }    
    }else if(type=="mobile_number_validations"){
      if (key!= 43 && key > 31 && (key < 48 || key > 57)) {
        event.preventDefault();
    }
    }
  }

  callCustomerPopup(){
    this.titleService.loading.next(false);
    const navigationExtras: NavigationExtras = {
      state: {
        parent: 'login'
      }
    };
    this.router.navigate(['/login/custPopup'], navigationExtras);
    }

  forPassValidate() {
    this.forgotPasswordForm.get('email').setValidators([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
    this.forgotPasswordForm.get('email').updateValueAndValidity();
  }

  clearInvalidationText() {
    this.resetLoginForm();
    this.Removevalidate();
    this.forgotPasswordForm.get('email').clearValidators();
    this.forgotPasswordForm.get('email').updateValueAndValidity();
    //$('#checkboxError').hide();
    $("#isCheckedForTerms"). prop("checked", false);
  }

  getCountryData(){
    this.loginService.getCountryMasterData().
      subscribe(
        (response) => {
          this.resp = JSON.parse(JSON.stringify(response));
          sessionStorage.setItem('countryData', JSON.stringify(response));
          
        },
        (error) => {}
      )
  }

  acceptTerms(){
    // $('#checkboxError').hide();
  }

  showCountryCode(data){
    this.countryName = data.country;
    this.countryCode = data.code;
    if(this.countryCode){
      this.hasCountrycode=true;
    }
  }

}


