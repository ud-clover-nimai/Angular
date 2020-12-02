import { Component, OnInit, EventEmitter, Output,ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import * as $ from '../../../../assets/js/jquery.min';
import { LcDetail } from 'src/app/beans/LCDetails';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { formatDate } from '@angular/common';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { TitleService } from 'src/app/services/titleservice/title.service';
import  { ValidateRegex } from '../../../beans/Validations';
import { call } from 'src/assets/js/bootstrap-filestyle.min'
import { loads } from 'src/assets/js/commons'
import { LoginService } from 'src/app/services/login/login.service';
import { ApplicantBeneficiaryComponent } from './applicant-beneficiary/applicant-beneficiary.component';
import * as FileSaver from 'file-saver';
import { OthersComponent } from './others/others.component';
import { TenorPaymentComponent } from './tenor-payment/tenor-payment.component';



@Component({
  selector: 'app-upload-lc',
  templateUrl: './upload-lc.component.html',
  styleUrls: ['./upload-lc.component.css']
})
export class UploadLCComponent implements OnInit {
  @ViewChild(ApplicantBeneficiaryComponent, { static: true }) ApplicantBeneficiary: ApplicantBeneficiaryComponent;
  @ViewChild(OthersComponent, { static: true }) Others: OthersComponent;
  @ViewChild(TenorPaymentComponent, { static: true }) tenor: TenorPaymentComponent;

  public lcDetailForm: FormGroup
  public selector: string = "Confirmation";
  public title: string = "New Transaction";
  public refinancing: boolean = false;
  public counter = 1;
  public saveCount = 0;
  public isPrev: boolean = false;
  public isNext: boolean = true;
  public isSave: boolean = false;
  public isPreview: boolean = false;
  public previewShow: boolean = false;
  public isEdit: boolean = false;
  public isConfirm: boolean = false;
  public loading: boolean = false;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');

  public lcDetail: LcDetail = null;
  public lc: any = null;
  public transactionID: string = null;
  public subURL: string = "";
  public parentURL: string = "";
  showUpdateButton: boolean = false;
  isUpdate: boolean = false;
  draftData: any;
  cloneData: any;
  document: any;
  countryName: any[];
  selectInfo: any;
  notImgDownload: boolean=false;
  imgDownload: boolean=false;
  fileData: any;
  currencies: any;
  portOfDischarge: any;
  goodsArray: any;
  isBankOther: boolean=false;
  othersStr: any="";
  currentDateTime: string;

  // rds: refinance Data Service
  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder,public loginService: LoginService, public router: Router, public rds: DataServiceService, public titleService: TitleService, public upls: UploadLcService,private el: ElementRef) {
    this.checkLcCount();
    this.goodsService();

    this.titleService.changeTitle(this.title);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    let navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "draftTransaction"){
        var trnsactionID = navigation.extras.state.trnsactionID;
        this.callDraftTransaction(trnsactionID);
      }
      else if(navigation.extras.state.redirectedFrom == "cloneTransaction"){
        var trnsactionID = navigation.extras.state.trnsactionID;
        this.callCloneTransaction(trnsactionID);
      }
    }

    this.setForm();
    this.lc = this.lcDetailForm.value;    
  }

  ngOnInit() {
    let elements = document.getElementsByTagName('input');
    for (var i = 0; i < elements.length; i++) {
      if(elements[i].value)
      elements[i].classList.add('has-value')
    }
    let elementTextarea = document.getElementsByTagName('textarea');
    for (var i = 0; i < elementTextarea.length; i++) {
      if(elementTextarea[i].value)
      elementTextarea[i].classList.add('has-value')
    }
    this.rds.refinanting.subscribe(flag => this.refinancing = flag);
    const lcd = this;
    $(document).ready(function () {
      const anchor: any[] = $('.nav-tabs').find('a');
      lcd.saveCount = anchor.length;

    })
    call();
    setTimeout(() => {
      loads();
    }, 500);
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));

      
    this.currencies = [...new Set(this.countryName.map(item => item.currency))];
  
    
  }
  ngAfterViewInit() {
    // document.getElementsByTagName('input') : to gell all Docuement imputs
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
     const selectList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('select'));
     selectList.forEach((select: HTMLElement) => {
      select.addEventListener('focus', () => {
        if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
          select.className="ng-valid ng-dirty ng-touched"   
        else 
          select.className="ng-valid ng-dirty ng-touched has-value"
      });
      select.addEventListener('blur', () => {
        if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
          select.className="ng-valid ng-dirty ng-touched"   
        else 
          select.className="ng-valid ng-dirty ng-touched has-value"
      });
  });
    const textareaList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('textarea'));
    textareaList.forEach((textarea: HTMLElement) => {
      textarea.addEventListener('focus', () => {
      if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
      textarea.className="ng-valid ng-dirty ng-touched"   
      else 
      textarea.className="ng-valid ng-dirty ng-touched has-value"
    });
    textarea.addEventListener('blur', () => {
      if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
      textarea.className="ng-valid ng-dirty ng-touched"   
      else 
      textarea.className="ng-valid ng-dirty ng-touched has-value"
    });
  });
 }

 
  public next() {
    let elements = document.getElementsByTagName('input');
    for (var i = 0; i < elements.length; i++) {
      if(elements[i].value)
      elements[i].classList.add('has-value')
    }
    let elementTextarea = document.getElementsByTagName('textarea');
    for (var i = 0; i < elementTextarea.length; i++) {
      if(elementTextarea[i].value)
      elementTextarea[i].classList.add('has-value')
    }
    this.previewShow = false;
    this.titleService.loading.next(true);

    const anchor: any[] = $('.nav-tabs').find('a');

    for (let index = 0; index < anchor.length; index++) {


      if (index == this.counter && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter + 1)) {
        $(anchor[index]).attr('aria-expanded', 'true');
        $(anchor[index]).parent().addClass('active')

        const tabpanes: any[] = $('.tab-content').find('.tab-pane')
        for (let i = 0; i < tabpanes.length; i++) {
          if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter + 1)) {
            $(tabpanes[i]).addClass('active');
          } else {
            $(tabpanes[i]).removeClass('active');
          }

        }
      } else {
        $(anchor[index]).attr('aria-expanded', 'false');
        $(anchor[index]).parent().removeClass('active')
      }


    }
    this.counter++;
    if (this.saveCount == this.counter) {
      this.isPrev = true;
      this.isNext = false;
      this.isSave = false;
      if(this.isUpdate){
        this.showUpdateButton = true;
        this.isPreview = false;
      }
      else{
        this.showUpdateButton = false;
        this.isPreview = true;
      }
    } else {
      this.isPrev = true;
    }
    this.titleService.loading.next(false);


  }

  public prev() {
    this.previewShow = false;
    this.titleService.loading.next(true);
    const anchor: any[] = $('.nav-tabs').find('a');
    this.counter--;

    for (let index = 0; index < anchor.length; index++) {

      if (index == (this.counter - 1) && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter)) {
        $(anchor[index]).attr('aria-expanded', 'true');
        $(anchor[index]).parent().addClass('active');

        const tabpanes: any[] = $('.tab-content').find('.tab-pane')
        for (let i = 0; i < tabpanes.length; i++) {
          if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter)) {
            $(tabpanes[i]).addClass('active');
          } else {
            $(tabpanes[i]).removeClass('active');
          }

        }
      } else {
        $(anchor[index]).attr('aria-expanded', 'false');
        $(anchor[index]).parent().removeClass('active')
      }

    }

    if (this.counter == 1) {
      this.isPrev = false;
      this.isNext = true;
      this.isSave = false;
      this.isPreview = false;
      this.showUpdateButton = false;

    } else {  
      this.isPrev = true;
      this.isNext = true;
      this.isSave = false;
      this.isPreview = false;
      this.showUpdateButton = false;
    }
    this.titleService.loading.next(false);
  }


  public save() {
    this.loading = true;
    this.titleService.loading.next(true);
    if(this.othersStr=='Others'){
     this.lcDetailForm.get('goodsType').setValue("Others - "+this.lcDetailForm.get('otherType').value)
    }

    let data = this.lcDetailForm.value;
    data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.lCExpiryDate = (data.lCExpiryDate) ? this.dateFormat(data.lCExpiryDate) : '';
    data.lastShipmentDate = (data.lastShipmentDate) ? this.dateFormat(data.lastShipmentDate) : '';
    data.negotiationDate = (data.negotiationDate) ? this.dateFormat(data.negotiationDate) : '';
    data.validity = (data.validity) ? this.dateFormat(data.validity) : '';
    data.requirementType = data.selector;
    data.lcMaturityDate = (data.lcMaturityDate) ? this.dateFormat(data.lcMaturityDate) : '';
    data.startDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    

    this.upls.saveLc(data)
      .subscribe(
        (response) => {
          this.transactionID = JSON.parse(JSON.stringify(response)).data;
          // sessionStorage.setItem("transactionID",this.transactionID);
          this.loading = false;
          this.lc = this.lcDetailForm.value;
          this.previewShow = true;
          this.isPrev = false;
          this.isNext = false;
          this.isSave = false;
          this.isPreview = false;
          this.showUpdateButton = false;
          this.isEdit = true;
          this.isConfirm = true;
          this.titleService.loading.next(false);
        },
        (error) => {
          this.loading = false;
          this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Failed',
              message: '',
              parent: this.subURL+"/"+this.parentURL +'/new-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
            .then(success => console.log('navigation error?', success))
            .catch(console.error);
        }
      )
  }

  public preview() {
    this.titleService.loading.next(true);
    this.save();
    // this.lc = this.lcDetailForm.value;
    // this.previewShow = true;
    // this.isPrev = false;
    // this.isNext = false;
    // this.isSave = false;
    // this.isPreview = false;
    // this.showUpdateButton = false;
    // this.isEdit = true;
    // this.isConfirm = true;
    this.titleService.loading.next(false);
    
  }

  public update(){
    this.loading = true;
    this.titleService.loading.next(true);
    if(this.othersStr=='Others'){
      this.lcDetailForm.get('goodsType').setValue("Others - "+this.lcDetailForm.get('otherType').value)
     }
    let data = this.lcDetailForm.value;
    data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.lCExpiryDate = (data.lCExpiryDate) ? this.dateFormat(data.lCExpiryDate) : '';
    data.lastShipmentDate = (data.lastShipmentDate) ? this.dateFormat(data.lastShipmentDate) : '';
    data.negotiationDate = (data.negotiationDate) ? this.dateFormat(data.negotiationDate) : '';
    data.validity = (data.validity) ? this.dateFormat(data.validity) : '';
    data.lcMaturityDate = (data.lcMaturityDate) ? this.dateFormat(data.lcMaturityDate) : '';
    data.requirementType = data.selector;
    data.startDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.transactionId = this.transactionID;

    
    
    var strs=data.validity;
    var strsplit=strs.split('T',2)
       this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')    
      
       if(strsplit[0]<this.currentDateTime ){
        $("#invalidDate").show();         
      }  else{
        this.upls.updateLc(data).subscribe(
          (response) => {
             this.transactionID = JSON.parse(JSON.stringify(response)).data;
            this.loading = false;
            this.titleService.loading.next(false);
            this.lc = this.lcDetailForm.value;
            this.previewShow = true;
            this.isPrev = false;
            this.isNext = false;
            this.isSave = false;
            this.isPreview = false;
            this.showUpdateButton = false;
            this.isEdit = true;
            this.isConfirm = true;
          },
          (error) => {
            this.loading = false;
            this.titleService.loading.next(false);
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Transaction Failed',
                message: '',
                parent: this.subURL+"/"+this.parentURL +'/new-transaction'
              }
            };
            this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
              .then(success => console.log('navigation error?', success))
              .catch(console.error);
          }
        )
      }
  }

  public confirm() {
  //  this.titleService.loading.next(true);
    //this.loading = true;
    let body = {
      transactionId: this.transactionID,
      userId: sessionStorage.getItem('userID')
    }

    // this.upls.confirmLc(body).subscribe(
    this.upls.checkDuplicateLC(body).subscribe(

        (response) => {
          var resp = JSON.parse(JSON.stringify(response)).status;
          var errmsg = JSON.parse(JSON.stringify(response)).errMessage;
          if(resp == "Failure"){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Transaction Failed',
                message: JSON.parse(JSON.stringify(response)).errMessage,
                parent: this.subURL+"/"+this.parentURL +'/new-transaction'
              }
            };
            this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
              .then(success => console.log('navigation error?', success))
              .catch(console.error);
          }
        
         

        if(errmsg=="No Duplicate LC"){
          this.setForm();
          this.edit();
          this.upls.confirmLc(body).subscribe(
        
                (response) => {
 const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Successful',
              message: 'Your LC Transaction has been successfully placed. Keep checking the Active Transaction section for the quotes received.',
              parent: this.subURL+"/"+this.parentURL + '/active-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          this.isUpdate = false;
                });
          // this.upls.confirmLcMailSent(emailBody).subscribe((resp) => {console.log("customer mail sent successfully");},(err) => {},);
          
          // this.upls.confirmLcMailSentToBank(emailBankBody).subscribe((resp) => {
          //   console.log("bank mail sent successfully");},(err) => {},);
        
         
        }  

        if(errmsg=="Duplicate LC") {
          $("#duplicatePopup").show();         
          }

        },
        (error) => {
          this.titleService.loading.next(false);
          this.loading = false;
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Failed',
              message: '',
              parent: this.subURL+"/"+this.parentURL +'/new-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
            .then(success => console.log('navigation error?', success))
            .catch(console.error);
        }
      )
  }

  invalidDateOk(){
    
    $("#invalidDate").hide();

  }

  dupPopYes(){
    $("#duplicatePopup").hide();
    this.setForm();
    this.edit();
    let body = {
      transactionId: this.transactionID,
      userId: sessionStorage.getItem('userID')
    }
    
    this.upls.confirmLc(body).subscribe(
        
      (response) => {
const navigationExtras: NavigationExtras = {
      state: {
        title: 'Transaction Successful',
        message: 'Your LC Transaction has been successfully placed. Keep checking the Active Transaction section for the quotes received.',
        parent: this.subURL+"/"+this.parentURL + '/active-transaction'
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/success`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
    this.isUpdate = false;
      });

    // this.upls.confirmLcMailSent(emailBody).subscribe((resp) => {console.log("customer mail sent successfully");},(err) => {},);
    
    // this.upls.confirmLcMailSentToBank(emailBankBody).subscribe((resp) => {
    //   console.log("bank mail sent successfully");},(err) => {},);
  
    
  }
  dupPopNo(){
    $("#duplicatePopup").hide();
  }

  public edit() {
    this.isUpdate = true;
    this.isEdit = false;
    this.isConfirm = false;
    this.previewShow = false;
    this.counter = 0;

    const anchor: any[] = $('.nav-tabs').find('a');

    for (let index = 0; index < anchor.length; index++) {


      if (index == this.counter && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter + 1)) {
        $(anchor[index]).attr('aria-expanded', 'true');
        $(anchor[index]).parent().addClass('active')

        const tabpanes: any[] = $('.tab-content').find('.tab-pane')
        for (let i = 0; i < tabpanes.length; i++) {
          if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter + 1)) {
            $(tabpanes[i]).addClass('active');
          } else {
            $(tabpanes[i]).removeClass('active');
          }

        }
      } else {
        $(anchor[index]).attr('aria-expanded', 'false');
        $(anchor[index]).parent().removeClass('active')
      }


    }
    this.counter++;


    this.isNext = true;
    this.isSave = false;
    this.isPreview = false;

    this.isPrev = false;



  }

  public setForm() {
    var userIdDetail = sessionStorage.getItem('userID');
    var emailId = "";
    if(userIdDetail.startsWith('BC')){
      emailId = sessionStorage.getItem('branchUserEmailId');
    }
    // else{
    //   emailId = sessionStorage.getItem('custUserEmailId');
    // }
    this.lcDetailForm = this.fb.group({
      selector: ['Confirmation'],
      userId: sessionStorage.getItem('userID'),
      requirementType: [''],
      lCIssuanceBank: [''],
      lCIssuanceBranch: [''],
      swiftCode: [''],
      lCIssuanceCountry: [''],
      branchUserEmail: emailId,
      lCValue: [''],
      lCCurrency: [''],
      lCIssuingDate: [''], 
      lastShipmentDate: [''],
      negotiationDate: [''],
      goodsType:[''],
      otherType:[''],
  
      // For Confirmation 
      confirmationPeriod: [''],
      paymentTerms: [''],
      startDate:[''],
      // tenorEndDate: [''],
      tenorFile: [''],
      // For Discounting 
      discountingPeriod:[''],
      remarks:[''],
  
      //For Refinancing
      originalTenorDays:[''],
      refinancingPeriod:[''],
      lcMaturityDate:[''],
      lcNumber:[''],
      lastBeneBank:[''],
      lastBeneSwiftCode:[''],
      lastBankCountry:[''],  
      
      applicantName:sessionStorage.getItem('companyName'),
      applicantCountry:sessionStorage.getItem('registeredCountry'),
  
      beneName:sessionStorage.getItem('companyName'),
      beneBankCountry:[''],
      beneBankName:[''],
      beneSwiftCode:[''],
      beneCountry:sessionStorage.getItem('registeredCountry'),
      
     
      loadingCountry:[''],
      loadingPort:[''],
      dischargeCountry:[''],
      dischargePort:[''],
  
      chargesType: [''],
      validity:[''],
      lcProForma:[''],
  
      lCExpiryDate:[''],    
      
      insertedDate:this.date,
      insertedBy:sessionStorage.getItem('userID'),
      modifiedDate:this.date,
      modifiedBy:sessionStorage.getItem('userID'),
      transactionflag:[''],
      transactionStatus:[''],
      userType:[''],
      applicantContactPerson:[''],
      applicantContactPersonEmail:[''],
      beneContactPerson:[''],
      beneContactPersonEmail:['']
    })
  }


  public dateFormat(date: string): string {
    let formatedDate = formatDate(new Date(date), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');
    return formatedDate;
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
    }
    else if(type == "alphaNumericNoSpace"){
      ValidateRegex.alphaNumericNoSpace(event);
    }
    else if(type == "date_validation"){     
      if (key!=191 && key!=189 && key > 31 && (key < 48 || key > 57)) {
        event.preventDefault();
      }
    }

  }
  onItemSelect(item) {
    var str = item; 
    var splittedStr =str.split(": ",2)
      this.othersStr=splittedStr[1];
    if(splittedStr[1]=="Others"){
      this.isBankOther=true;      
     // loads();
    }else{
      this.isBankOther=false;
    }
  }
  selectCountryInfo(e){
   let country= this.lcDetailForm.get('lCIssuanceCountry').value;
    const param={
      "lCIssuanceCountry":country
      }
    this.upls.getBankCountForCountry(param).subscribe((response)=>{
this.selectInfo=   JSON.parse(JSON.stringify(response)).data;
    })

    }

  callDraftTransaction(trnsactionID){
    this.transactionID = trnsactionID;
    const param = {
      transactionId: trnsactionID
    }
    let emailBodyUpdate = {
      "transactionid": trnsactionID,
      "userId": sessionStorage.getItem('userID'),
      "event": "LC_UPDATE"
      }
    this.isUpdate = true;
    
    this.upls.getCustspecificDraftTransaction(param).subscribe(
      (response) => {
        this.draftData = JSON.parse(JSON.stringify(response)).data;
        if(this.draftData.goodsType.startsWith('Others')){
          this.isBankOther=true;      
          var str = this.draftData.goodsType; 
          var splittedStr =str.split(" - ",2)
            this.othersStr=splittedStr[0];
       this.draftData.goodsType=this.othersStr;
       this.draftData.otherType=splittedStr[1];

         }else{
           this.isBankOther=false;
         }
  // this.draftData = JSON.parse(JSON.stringify(response)).data;
        // var str = this.draftData.tenorFile; 
        // var splittedStr = str.split(" |", 1); 
        // console.log(splittedStr[0]);

        this.ngOnInit();
        this.ApplicantBeneficiary.onItemChange(this.draftData.userType)
        this.Others.portDischargeOnchange(this.draftData.dischargeCountry)
        this.Others.portLoadingOnchange(this.draftData.loadingCountry)
        this.lcDetailForm.patchValue({
          userId: this.draftData.userId,
          selector: this.draftData.requirementType,
          lCIssuanceBank: this.draftData.lCIssuanceBank,
          lCIssuanceBranch: this.draftData.lCIssuanceBranch,
          swiftCode: this.draftData.swiftCode,
          lCIssuanceCountry: this.draftData.lCIssuanceCountry,
      
          lCValue: this.draftData.lCValue,
          lCCurrency: this.draftData.lCCurrency,
          lCIssuingDate: this.setDateFromApi(this.draftData.lCIssuingDate),
          lastShipmentDate: this.setDateFromApi(this.draftData.lastShipmentDate),
          negotiationDate: this.setDateFromApi(this.draftData.negotiationDate),
          goodsType:this.draftData.goodsType,
          otherType:this.draftData.otherType,

          // For Confirmation 
          confirmationPeriod: this.draftData.confirmationPeriod,
          paymentTerms: this.draftData.paymentTerms,
          startDate:this.draftData.startDate,
          // tenorEndDate: this.draftData.tenorEndDate,
      
          // For Discounting 
          discountingPeriod:this.draftData.discountingPeriod,
          remarks:this.draftData.remarks,
      
          //For Refinancing
          originalTenorDays:this.draftData.originalTenorDays,
          refinancingPeriod:this.draftData.refinancingPeriod,
       //  lcMaturityDate:this.draftData.lcMaturityDate,
          lcMaturityDate:this.setDateFromApi(this.draftData.lcMaturityDate),
          tenorFile:this.draftData.tenorFile,
          lcNumber:this.draftData.lcNumber,
          lastBeneBank:this.draftData.lastBeneBank,
          lastBeneSwiftCode:this.draftData.lastBeneSwiftCode,
          lastBankCountry:this.draftData.lastBankCountry,
      
          
          applicantName:this.draftData.applicantName,
          applicantCountry:this.draftData.applicantCountry,
      
          beneName:this.draftData.beneName,
          beneBankCountry:this.draftData.beneBankCountry,
          beneBankName:this.draftData.beneBankName,
          beneSwiftCode:this.draftData.beneSwiftCode,
          beneCountry:this.draftData.beneCountry,
          
         
          loadingCountry:this.draftData.loadingCountry,
          loadingPort:this.draftData.loadingPort,
          dischargeCountry:this.draftData.dischargeCountry,
          dischargePort:this.draftData.dischargePort,
      
          chargesType: this.draftData.chargesType,
          validity:this.setDateFromApi(this.draftData.validity),
          lcProForma:this.draftData.lcProForma,
      
          lCExpiryDate:this.draftData.lCExpiryDate,    
          
          insertedDate: this.draftData.insertedDate,
          insertedBy: this.draftData.insertedBy,
          modifiedDate: this.draftData.modifiedDate,
          modifiedBy: this.draftData.modifiedBy,
          transactionflag: this.draftData.transactionflag,
          transactionStatus: this.draftData.transactionStatus,
          userType:this.draftData.userType,
          applicantContactPerson:this.draftData.applicantContactPerson,
          applicantContactPersonEmail:this.draftData.applicantContactPersonEmail,
          beneContactPerson:this.draftData.beneContactPerson,
          beneContactPersonEmail:this.draftData.beneContactPersonEmail,
        });
    // this.lc = this.lcDetailForm.value;
      
  }     
      ,(error) =>{
      }
      )
  }

  callCloneTransaction(trnsactionID){
    this.transactionID = trnsactionID;
    var data = {
      "transactionId":trnsactionID
      }
  
      this.upls.custCloneTransaction(data).subscribe(
        (response) => {
          this.cloneData = JSON.parse(JSON.stringify(response)).data;

          if(this.cloneData.goodsType.startsWith('Others')){
            this.isBankOther=true;      
            var str = this.cloneData.goodsType; 
            var splittedStr =str.split(" - ",2)
              this.othersStr=splittedStr[0];
         this.cloneData.goodsType=this.othersStr;
         this.cloneData.otherType=splittedStr[1];
  
           }else{
             this.isBankOther=false;
           }
          this.ngOnInit();    
          this.Others.portDischargeOnchange(this.cloneData.dischargeCountry)
          this.Others.portLoadingOnchange(this.cloneData.loadingCountry)
          this.ApplicantBeneficiary.onItemChange(this.cloneData.userType);  
        this.lcDetailForm.patchValue({
          userId: this.cloneData.userId,
          selector: this.cloneData.requirementType,
          lCIssuanceBank: this.cloneData.lCIssuanceBank,
          lCIssuanceBranch: this.cloneData.lCIssuanceBranch,
          swiftCode: this.cloneData.swiftCode,
          lCIssuanceCountry: this.cloneData.lCIssuanceCountry,
      
          lCValue: this.cloneData.lCValue,
          lCCurrency: this.cloneData.lCCurrency,
          lCIssuingDate: this.setDateFromApi(this.cloneData.lCIssuingDate),
          lastShipmentDate: this.setDateFromApi(this.cloneData.lastShipmentDate),
          negotiationDate: this.setDateFromApi(this.cloneData.negotiationDate),
          goodsType:this.cloneData.goodsType,
      
      
          // For Confirmation 
          confirmationPeriod: this.cloneData.confirmationPeriod,
          paymentTerms: this.cloneData.paymentTerms,
          startDate:this.cloneData.startDate,
          // tenorEndDate: this.cloneData.tenorEndDate,
      
          // For Discounting 
          discountingPeriod:this.cloneData.discountingPeriod,
          remarks:this.cloneData.remarks,
      
          //For Refinancing
          originalTenorDays:this.cloneData.originalTenorDays,
          refinancingPeriod:this.cloneData.refinancingPeriod,
          lcMaturityDate:this.setDateFromApi(this.cloneData.lcMaturityDate),
          lcNumber:this.cloneData.lcNumber,
                    lastBeneBank:this.cloneData.lastBeneBank,
          lastBeneSwiftCode:this.cloneData.lastBeneSwiftCode,
          lastBankCountry:this.cloneData.lastBankCountry,
      
          
          applicantName:this.cloneData.applicantName,
          applicantCountry:this.cloneData.applicantCountry,
      
          beneName:this.cloneData.beneName,
          beneBankCountry:this.cloneData.beneBankCountry,
          beneBankName:this.cloneData.beneBankName,
          beneSwiftCode:this.cloneData.beneSwiftCode,
          beneCountry:this.cloneData.beneCountry,
          
         
          loadingCountry:this.cloneData.loadingCountry,
          loadingPort:this.cloneData.loadingPort,
          dischargeCountry:this.cloneData.dischargeCountry,
          dischargePort:this.cloneData.dischargePort,
      
          chargesType: this.cloneData.chargesType,
          validity:this.setDateFromApi(this.cloneData.validity),
          lcProForma:this.cloneData.lcProForma,
      
          lCExpiryDate:this.cloneData.lCExpiryDate,    
          
          insertedDate: this.cloneData.insertedDate,
          insertedBy: this.cloneData.insertedBy,
          modifiedDate: this.cloneData.modifiedDate,
          modifiedBy: this.cloneData.modifiedBy,
          transactionflag: this.cloneData.transactionflag,
          transactionStatus: this.cloneData.transactionStatus,
          userType:this.cloneData.userType,
          applicantContactPerson:this.cloneData.applicantContactPerson,
          applicantContactPersonEmail:this.cloneData.applicantContactPersonEmail,
          beneContactPerson:this.cloneData.beneContactPerson,
          beneContactPersonEmail:this.cloneData.beneContactPersonEmail,
        });
        this.tenor.selectors(this.cloneData.requirementType) 
console.log(this.cloneData.requirementType)
        },
        (err) => {}
    ) 
  }

  setDateFromApi(inDate){
    if(inDate == undefined){
      inDate = '';
    }
    else{
      inDate = new Date(inDate);
    }
    return inDate;
  }

  openDocument(file){
    console.log(file)
    $('#myModal7').show();
    var str = file; 
    var splittedStr = str.split(" |", 2); 
    var filename=str.split(" |", 1); 
    var filename=splittedStr[0];
    var ext = filename.split("."); 
     if(ext[1]=='jpeg' || ext[1]=='jpg' || ext[1]=='png' || ext[1]=='svg'){
      this.imgDownload=true;
     }else{
      this.imgDownload=false;
     }
    var data=splittedStr[1];
    this.document = data;
    this.fileData=file;
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

  close(){
    $('.modal3').hide();
  }

  checkLcCount(){
    var data = {
      "userId": sessionStorage.getItem("userID")
      }
  
      this.upls.checkLcCount(data).subscribe(
        (response) => {
          var resp = JSON.parse(JSON.stringify(response)).status;

          if(resp == "Failure"){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Transaction Not Allowed !',
                message: 'You had reached maximum LC Count ! Please Renew Your Subscribe Plan',
                parent: this.subURL+"/"+this.parentURL + '/subscription',
                redirectedFrom: "New-Transaction"
              }
            };
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
              .then(success => console.log('navigation success?', success))
              .catch(console.error);
          }
        },
        (err) => {}
      )
  }
  convertbase64toArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  download(){
    var str = this.fileData;
    var splittedStr = str.split(" |", 2); 
    var data=splittedStr[1];
    var base64string = data;
    
    var filename=splittedStr[0];
    var filename=splittedStr[0];
    var ext = filename.split("."); 
    var extension='.'+ext[1];

    if(extension=='.xlsx'){
      base64string= base64string.replace('data:application/octet-stream;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type:'application/octet-stream'});
      FileSaver.saveAs(blob, filename);
    } 
    else if(extension=='.xls'){
      var  base64string= base64string.replace('data:application/octet-stream;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type:'application/vnd.ms-excel'});
        FileSaver.saveAs(blob, filename);
        this.imgDownload=false;
      } 
      else if(extension=='.doc'){
        base64string= base64string.replace('data:application/octet-stream;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/msword' });
        FileSaver.saveAs(blob,filename);
        this.imgDownload=false;

    }
    else if(extension=='.pdf'){
      base64string= base64string.replace('data:application/pdf;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type: 'application/pdf' });
      FileSaver.saveAs(blob, filename);
    }  
     else if(extension=='.docx'){
        base64string= base64string.replace('data:application/octet-stream;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        FileSaver.saveAs(blob,filename );
    }
     else if(extension=='.csv'){
            base64string= base64string.replace('data:application/octet-stream;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'text/csv' });
            FileSaver.saveAs(blob, filename);
          }
          else if(extension=='.jpeg' || extension=='.jpg' || extension=='.png' || extension=='.svg'){
            base64string= base64string.replace('data:image/jpeg;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/jpeg' });
            FileSaver.saveAs(blob, filename );

          }     
           
              
              }
}
