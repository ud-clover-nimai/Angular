import { Component, OnInit, EventEmitter, Output,ElementRef } from '@angular/core';
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



@Component({
  selector: 'app-upload-lc',
  templateUrl: './upload-lc.component.html',
  styleUrls: ['./upload-lc.component.css']
})
export class UploadLCComponent implements OnInit {

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
  dateToPass: any;
  document: any;


  // rds: refinance Data Service
  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder, public router: Router, public rds: DataServiceService, public titleService: TitleService, public upls: UploadLcService,private el: ElementRef) {
    this.checkLcCount();

    this.titleService.changeTitle(this.title);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    let navigation = this.router.getCurrentNavigation();
    console.log(navigation);
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "draftTransaction"){
        console.log("..."+ navigation.extras.state.redirectedFrom);
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
    let data = this.lcDetailForm.value;
    data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.lCExpiryDate = (data.lCExpiryDate) ? this.dateFormat(data.lCExpiryDate) : '';
    data.lastShipmentDate = (data.lastShipmentDate) ? this.dateFormat(data.lastShipmentDate) : '';
    data.negotiationDate = (data.negotiationDate) ? this.dateFormat(data.negotiationDate) : '';
    data.validity = (data.validity) ? this.dateFormat(data.validity) : '';
    data.requirementType = data.selector;
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
    let data = this.lcDetailForm.value;
    data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.lCExpiryDate = (data.lCExpiryDate) ? this.dateFormat(data.lCExpiryDate) : '';
    data.lastShipmentDate = (data.lastShipmentDate) ? this.dateFormat(data.lastShipmentDate) : '';
    data.negotiationDate = (data.negotiationDate) ? this.dateFormat(data.negotiationDate) : '';
    data.validity = (data.validity) ? this.dateFormat(data.validity) : '';
    data.requirementType = data.selector;
    data.startDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.transactionId = this.transactionID;

    this.upls.updateLc(data).subscribe(
        (response) => {
          // this.transactionID = JSON.parse(JSON.stringify(response)).data;
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

  public confirm() {
    this.titleService.loading.next(true);
    this.loading = true;
    let body = {
      transactionId: this.transactionID,
      userId: sessionStorage.getItem('userID')
    }

    let emailBody = {
      "transactionid": this.transactionID,
      "userId": sessionStorage.getItem('userID'),
      "event": "LC_UPLOAD"
      }
    
    let emailBankBody = {
      "transactionId": this.transactionID,
      "customerUserId": sessionStorage.getItem('userID'),
      "event": "LC_UPLOAD_ALERT_ToBanks"
      }
    this.upls.confirmLc(body)
      .subscribe(
        (response) => {
          var resp = JSON.parse(JSON.stringify(response)).status;
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
          else{            
          this.setForm();
          this.edit();
          this.loading = false;
          this.titleService.loading.next(false);
          this.upls.confirmLcMailSent(emailBody).subscribe((resp) => {console.log("customer mail sent successfully");},(err) => {},);
          
          this.upls.confirmLcMailSentToBank(emailBankBody).subscribe((resp) => {console.log("bank mail sent successfully");},(err) => {},);
        
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
  
  
      // For Confirmation 
      confirmationPeriod: [''],
      paymentTerms: [''],
      startDate:[''],
      // tenorEndDate: [''],
      tenor_file: [''],
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
      userType:['Applicant'],
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
    }else if(type == "date_validation"){     
      if (key!=191 && key!=189 && key > 31 && (key < 48 || key > 57)) {
        event.preventDefault();
      }
    }

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

        this.upls.confirmLcMailSent(emailBodyUpdate).subscribe((resp) => {console.log("Email sent successfully");},(err) => {},);

         this.draftData = JSON.parse(JSON.stringify(response)).data;
         console.log(this.draftData);
        this.dateToPass = new Date(this.draftData.lCIssuingDate); 
        this.lcDetailForm.patchValue({
          userId: this.draftData.userId,
          selector: this.draftData.requirementType,
          lCIssuanceBank: this.draftData.lCIssuanceBank,
          lCIssuanceBranch: this.draftData.lCIssuanceBranch,
          swiftCode: this.draftData.swiftCode,
          lCIssuanceCountry: this.draftData.lCIssuanceCountry,
      
          lCValue: this.draftData.lCValue,
          lCCurrency: this.draftData.lCCurrency,
          lCIssuingDate: this.draftData.lCIssuingDate,
          lastShipmentDate: this.draftData.lastShipmentDate,
          negotiationDate: this.draftData.negotiationDate,
          goodsType:this.draftData.goodsType,
      
      
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
          lcMaturityDate:this.draftData.lcMaturityDate,
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
          validity:this.draftData.validity,
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
      },(error) =>{
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
          console.log(this.cloneData);
         
        this.lcDetailForm.patchValue({
          userId: this.cloneData.userId,
          selector: this.cloneData.requirementType,
          lCIssuanceBank: this.cloneData.lCIssuanceBank,
          lCIssuanceBranch: this.cloneData.lCIssuanceBranch,
          swiftCode: this.cloneData.swiftCode,
          lCIssuanceCountry: this.cloneData.lCIssuanceCountry,
      
          lCValue: this.cloneData.lCValue,
          lCCurrency: this.cloneData.lCCurrency,
          lCIssuingDate: this.cloneData.lCIssuingDate,
          lastShipmentDate: this.cloneData.lastShipmentDate,
          negotiationDate: this.cloneData.negotiationDate,
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
          lcMaturityDate:this.cloneData.lcMaturityDate,
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
          validity:this.cloneData.validity,
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
        },
        (err) => {}
    ) 
  }

  openDocument(file){
    $('#myModal7').show();
    this.document = file;
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
}
