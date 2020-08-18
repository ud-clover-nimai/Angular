import { Component, OnInit,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { Business } from 'src/app/beans/business';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { loads } from '../../../assets/js/commons'
import { OwnerDetail } from 'src/app/beans/ownerdetail';
import { ValidateRegex } from '../../beans/Validations';



@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css']
})
export class BusinessDetailsComponent implements OnInit {
  public loading = true;
  public businessDetailsForm: FormGroup;
  public bd: Business = null;
  public title: string = "Business Details";
  public isCustomer = true;
  public parentURL: string = "";
  public subURL: string = "";
  public perDetailsSubmit = false;
  public hasValue=false;
  resp: any;
  parentRedirection: string = "subscription";

  constructor(public fb: FormBuilder, public router: Router, public titleService: TitleService, public bds: BusinessDetailsService, private activatedRoute: ActivatedRoute,private el: ElementRef) {
  
    setTimeout(() => {
      this.titleService.loading.next(false);
      }, 2000);

    if(sessionStorage.getItem('userID'))
    {
      this.hasValue=true;
    }else{
      this.hasValue=false;
    }
    this.getBusinessDetails(sessionStorage.getItem('userID'));
    let navigation = this.router.getCurrentNavigation();

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    console.log(navigation);
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "MyProfile"){
        this.parentRedirection = "my-profile";
      }
    }

    this.businessDetailsForm = this.fb.group({
      userId: [''],
      selector: ['', Validators.required],
      companyName: ['', [Validators.required,Validators.minLength(4)]],
      bank_designation: ['', [Validators.required,Validators.minLength(2)]],
      country: ['', Validators.required],
      provinceName: ['',Validators.required],
      city: ['', [Validators.required,Validators.minLength(2)]],
      addressLine1: ['', [Validators.required,Validators.minLength(2)]],
      addressLine2: ['', [Validators.required,Validators.minLength(2)]],
      addressLine3: ['',Validators.minLength(2)],
      pincode: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(6)]],
      telephone: ['',Validators.minLength(7)],
      bankNbfcName: ['',[Validators.required,Validators.minLength(3)]],
      branchName: ['', [Validators.required,Validators.minLength(3)]],
      swiftCode: ['', [Validators.required,Validators.minLength(3)]],
      lCCurrencyValue: [''],
      owners: this.fb.array([this.getOwners()])
    });
    //this.add(0);
    this.titleService.changeTitle(this.title);
  }
  getOwners(){
    return this.fb.group({
    ownerFirstName: ['', Validators.required],
    ownerLastName: ['', Validators.required],
    designation: ['', [Validators.required,Validators.minLength(2)]],
    ownerID: ['']
  });
  }
  get busiDetails() {
    return this.businessDetailsForm.controls;
  }


  ngOnInit() { 
    loads();
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
   }
   ngAfterViewInit() {
     const selectList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('select'));
     selectList.forEach((select: HTMLElement) => {
      select.addEventListener('focus', () => {
        if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
          select.className=" has-value ng-valid ng-dirty ng-touched"   
        else 
          select.className="ng-valid ng-dirty ng-touched has-value"
      });
      select.addEventListener('blur', () => {
        if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
          select.className="has-value ng-valid ng-dirty ng-touched"   
        else 
          select.className="ng-valid ng-dirty ng-touched has-value"
      });
  });
 }
  setValidators() {
  console.log("this.isCustomer",this.isCustomer)
    if (this.isCustomer == false) {
      this.businessDetailsForm.get("bankNbfcName").enable();
      this.businessDetailsForm.get("branchName").enable();
      this.businessDetailsForm.get("swiftCode").enable();
      this.businessDetailsForm.get("companyName").disable();
      this.businessDetailsForm.get("owners").disable();
      this.businessDetailsForm.get("selector").disable();
      this.businessDetailsForm.get("bank_designation").enable();
      this.businessDetailsForm.get('telephone').setValidators([Validators.required,Validators.minLength(7)]);

    } else {
      this.businessDetailsForm.get("bankNbfcName").disable();
      this.businessDetailsForm.get("branchName").disable();
      this.businessDetailsForm.get("swiftCode").disable();
      this.businessDetailsForm.get("companyName").enable();
      this.businessDetailsForm.get("owners").enable();
      this.businessDetailsForm.get("selector").enable();
      this.businessDetailsForm.get("bank_designation").disable();
      this.businessDetailsForm.get('telephone').setValidators(Validators.minLength(7));

    }

  }

  validateCommons(){
    this.businessDetailsForm.get('companyName').setValidators(Validators.required);
  }
  submit(): void {
    this.validateCommons();
    this.titleService.loading.next(true);
    this.perDetailsSubmit = true;
    let items = this.businessDetailsForm.get('owners') as FormArray;
    console.log("items",items.controls)
    console.log("this.businessDetailsForm.invalid",this.businessDetailsForm)
    if (this.businessDetailsForm.invalid) {
      // ignore: ['#hidden',':not(:visible)']
      return;
    }
    sessionStorage.setItem('companyName',this.businessDetailsForm.get('companyName').value);
    sessionStorage.setItem('registeredCountry',this.businessDetailsForm.get('country').value);

    this.perDetailsSubmit = false;

    this.bds.updateBusinessDetails(this.getBusinessData(), this.businessDetailsForm.get('userId').value).subscribe(
      (response) => {
        this.titleService.loading.next(false);
        const navigationExtras: NavigationExtras = {
          state: {
            title: 'Congratulations! Your Business Details has been successfully submitted!',
            message: '',
            parent: this.subURL + '/' + this.parentURL + '/' + this.parentRedirection

          }
        };
        
        this.router.navigate([`/${this.subURL}/${this.parentURL}/business-details/success`], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      },
      (error) => {
        this.titleService.loading.next(false);
        let responserror = JSON.parse(JSON.stringify(error));
        console.log(responserror)
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: this.subURL + '/' + this.parentURL + '/business-details'
          }

        };
        this.router.navigate([`/${this.subURL}/${this.parentURL}/business-details/error`], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      }
    )

  }

  public getBusinessDetails(userID: string) {
    this.titleService.loading.next(true);
    this.bds.viewBusinessDetails(userID).subscribe(
      (response) => {
        let responseData = JSON.parse(JSON.stringify(response));
        this.bd = responseData.data;
        if (this.bd.userId.startsWith('BA') || this.bd.userId.startsWith('RE')) {
          this.isCustomer = false;
        } else if (this.bd.userId.startsWith('CU') || this.bd.userId.startsWith('BC')) {
          this.isCustomer = true;

        }
        console.log("this.isCustomer",this.isCustomer)
        this.setValidators();
        this.businessDetailsForm.patchValue({
          bankNbfcName: this.bd.bankName,

          branchName: this.bd.branchName,
          swiftCode: this.bd.swiftCode,
          telephone: this.bd.telephone,
          bank_designation: this.bd.designation,
          companyName: this.bd.comapanyName,
          country: this.bd.registeredCountry,
          selector: this.bd.registrationType,
          provinceName: this.bd.provinceName,
          addressLine1: this.bd.address1,
          addressLine2: this.bd.address2,
          addressLine3: this.bd.address3,
          city: this.bd.city,
          pincode: this.bd.pincode,
          userId: this.bd.userId
        })

        if (this.bd.ownerMasterBean.length > 0)
          this.addOwner(this.bd.ownerMasterBean);

        const bd = this;
        setTimeout(() => {
          loads();
          bd.loading = false;
          this.titleService.loading.next(false);
        }, 1000);

        sessionStorage.setItem('companyName',this.bd.comapanyName);
        sessionStorage.setItem('registeredCountry',this.bd.registeredCountry);
      },
      (error) => {
        this.titleService.loading.next(false);
      }
    )
  }


  public getBusinessData(): Business {

    let data = {
      userId: this.businessDetailsForm.get('userId').value,
      bankName: this.businessDetailsForm.get('bankNbfcName').value,
      branchName: this.businessDetailsForm.get('branchName').value,
      swiftCode: this.businessDetailsForm.get('swiftCode').value,
      telephone: this.businessDetailsForm.get('telephone').value,
      comapanyName: this.businessDetailsForm.get('companyName').value,
      designation:this.businessDetailsForm.get('bank_designation').value,
      registeredCountry: this.businessDetailsForm.get('country').value,
      registrationType: this.businessDetailsForm.get('selector').value,
      provinceName: this.businessDetailsForm.get('provinceName').value,
      address1: this.businessDetailsForm.get('addressLine1').value,
      address2: this.businessDetailsForm.get('addressLine2').value,
      address3: this.businessDetailsForm.get('addressLine3').value,
      city: this.businessDetailsForm.get('city').value,
      pincode: this.businessDetailsForm.get('pincode').value,
      ownerMasterBean: this.businessDetailsForm.get('owners').value
    };
    return data;
  }


  selectRegType(value: string) {

  }

  // createItem(): FormGroup {
  //   return this.fb.group({
  //     ownerFirstName: '',
  //     ownerLastName: '',
  //     designation: '',
  //     ownerID: ''
  //   });
  // }
  createOwnerItem(data: OwnerDetail): FormGroup {
    return this.fb.group({
      ownerFirstName: data.ownerFirstName,
      ownerLastName: data.ownerLastName,
      designation: data.designation,
      ownerID: data.ownerID
    });
  }

  addOwner(owners: OwnerDetail[]) {
    this.removeAll();
    let items = this.businessDetailsForm.get('owners') as FormArray;
    for (let owner of owners)
    {
      items.push(this.createOwnerItem(owner)); 
    }
  }


  add(i: number) {
    let items = this.businessDetailsForm.get('owners') as FormArray;
    if (items.length < 3)
    {
      items.push(this.getOwners());
    }
  }

  remove(i: number) {
    let items = this.businessDetailsForm.get('owners') as FormArray;
    items.removeAt(i);
  }

  removeAll() {
    let items = this.businessDetailsForm.get('owners') as FormArray;
    for (let x = 0; x < items.length; x++)
      items.removeAt(x);
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
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/ || key==188/* , key*/ || key > 31 && (key < 48 || key > 57))) {
          event.preventDefault();
      }    
    }else if(type=="name_validation"){
      var key = event.keyCode;
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/)) {
          event.preventDefault();
      }    
    }
  }

}
