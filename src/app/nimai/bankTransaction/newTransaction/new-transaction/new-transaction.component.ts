import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { bankNewTransaction, } from 'src/assets/js/commons'
import { FormBuilder, FormControl } from '@angular/forms';
import { RefinancingComponent } from '../quotes/refinancing/refinancing.component';
import { ConfirmAndDiscountComponent } from '../quotes/confirm-and-discount/confirm-and-discount.component';
import { ConfirmationComponent } from '../quotes/confirmation/confirmation.component';
import { DiscountingComponent } from '../quotes/discounting/discounting.component';
import { BankerComponent } from '../quotes/banker/banker.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Tflag } from 'src/app/beans/Tflag';
import { newTransactionBean } from 'src/app/beans/BankNewTransaction';
import { formatDate } from '@angular/common';
import * as $ from 'src/assets/js/jquery.min';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {removeDoubleScroll} from 'src/assets/js/commons'
import * as FileSaver from 'file-saver';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';


@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {
  bankDetail: any;
  public data: newTransactionBean;
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime', 'validity', 'ib', 'amount', 'ccy', 'goodsTypes', 'requirement', 'receivedQuotes', 'star'];
  dataSource: MatTableDataSource<any>;
  public ntData: any[] = [];
  public isActive: boolean = false;
  document: any;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  viewData:any;

  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');

  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public detail: any;
  public parentURL: string = "";
  public subURL: string = "";
  public detailInfo: string = "";
  public imgDownload:boolean=false;
  public notImgDownload:boolean=false;
  fileData: any;
  nimaiCount: any;

  constructor(public titleService: TitleService,public getCount: SubscriptionDetailsService, public nts: NewTransactionService, private formBuilder: FormBuilder,
     public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });

    this.titleService.quote.next(false);

    this.data = {
      transactionId: "",
      userId: "",
      requirementType: "",
      lCIssuanceBank: "",
      lCIssuanceBranch: "",
      swiftCode: 0,
      lCIssuanceCountry: "",
      lCIssuingDate: null,
      lCExpiryDate: null,
      lCValue: null,
      lCCurrency: "",
      lastShipmentDate: null,
      negotiationDate: null,
      paymentPeriod: 0,
      paymentTerms: "",
      tenorEndDate: null,
      applicantName: "",
      applicantCountry: "",
      beneName: "",
      beneBankCountry: "",
      beneBankName: "",
      beneSwiftCode: "",
      beneCountry: "",
      loadingCountry: "",
      loadingPort: "",
      dischargeCountry: "",
      dischargePort: null,
      chargesType: "",
      validity: null,
      insertedDate: null,
      insertedBy: "",
      modifiedDate: null,
      modifiedBy: "",
      transactionflag: null,
      transactionStatus: "",
      branchUserId: null,
      branchUserEmail: null,
      goodsType: "",
      usanceDays: null,
      startDate: null,
      endDate: null,
      originalTenorDays: null,
      refinancingPeriod: "",
      lcMaturityDate: null,
      lcNumber: '',
      lastBeneBank: "",
      lastBeneSwiftCode: "",
      lastBankCountry: "",
      remarks: "",
      discountingPeriod: "",
      confirmationPeriod: null,
      financingPeriod: null,
      lcProForma: "",
      tenorFile: null,
      lccountry: [],
      lcgoods: [],
      lcbanks: [],
      lcbranch: [],
      applicantContactPersonEmail: '',
      beneContactPerson: '',
      beneContactPersonEmail: '',
      userType: '',
      applicantContactPerson: '',
      closedQuote: '',
      quotationStatus:''
    }
  }
  ngOnInit() {
    this.getNimaiCount();

  }


  getNimaiCount() {
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": ""
    }

    this.getCount.getTotalCount(data).subscribe(
      response => {
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
     if(this.nimaiCount.lc_count<=this.nimaiCount.lcutilizedcount){
        const navigationExtras: NavigationExtras = {
                      state: {
                        title: 'Transaction Not Allowed !',
                        message: 'You had reached maximum LC Count ! Please Renew Your Subscription Plan',
                        parent: this.subURL+"/"+this.parentURL + '/subscription',
                        redirectedFrom: "New-Transaction"
                      }
                    };
                    this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
                      .then(success => console.log('navigation success?', success))
                      .catch(console.error);
                  
       }
      },
      error => { }
    )
  }

  // checkLcCount(){
  //   var data = {
  //     "userId": sessionStorage.getItem("userID")
  //     }
  
  //     this.upls.checkLcCount(data).subscribe(
  //       (response) => {
  //         var resp = JSON.parse(JSON.stringify(response)).status;

  //         if(resp == "Failure"){
  //           const navigationExtras: NavigationExtras = {
  //             state: {
  //               title: 'Transaction Not Allowed !',
  //               message: 'You had reached maximum LC Count ! Please Renew Your Subscribe Plan',
  //               parent: this.subURL+"/"+this.parentURL + '/subscription',
  //               redirectedFrom: "New-Transaction"
  //             }
  //           };
  //           this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
  //             .then(success => console.log('navigation success?', success))
  //             .catch(console.error);
  //         }
  //       },
  //       (err) => {}
  //     )
  // }
  
  refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/new-request`]);
  });
  }

  public getNewRequestsForBank() {
    const data = {
      "userId": sessionStorage.getItem('userID')
    }

    this.nts.getAllNewBankRequest(data).subscribe(
      (response) => {
        this.detail = JSON.parse(JSON.stringify(response)).data;
        bankNewTransaction();
        if (!this.detail) {
          this.hasNoRecord = true;
        }
      }, (error) => {
        this.hasNoRecord = true;
      }
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
  showProForma(file) {
    $('#myModalAttach').show();
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

  download(){
    var str = this.fileData; 
    var splittedStr = str.split(" |", 2); 
    var data=splittedStr[1];
    var  base64string = data;
    
    var filename=splittedStr[0];
    var ext = filename.split("."); 
    var extension='.'+ext[1];

    if(extension=='.xlsx'){
    var  base64string= base64string.replace('data:application/octet-stream;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type:'application/octet-stream'});
      FileSaver.saveAs(blob, filename);
      this.notImgDownload=true;
      this.imgDownload=false;
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
      this.notImgDownload=true;
      this.imgDownload=false;

    }  
     else if(extension=='.docx'){
        base64string= base64string.replace('data:application/octet-stream;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        FileSaver.saveAs(blob,filename);
        this.notImgDownload=true;
        this.imgDownload=false;

    }
     else if(extension=='.csv'){
            base64string= base64string.replace('data:application/octet-stream;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'text/csv' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=false;
            this.notImgDownload=true;

          }
          else if(extension=='.jpeg' || extension=='.jpg' || extension=='.png' || extension=='.svg'){
            base64string= base64string.replace('data:image/jpeg;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/jpeg' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;
            this.notImgDownload=false;

          }     
           
              
              }

  ngAfterViewInit() {
    this.getNewRequestsForBank();
    this.confirmation.isActiveQuote = false;
    this.confirmAndDiscount.isActiveQuote = false;
    this.discounting.isActiveQuote = false;
    this.refinancing.isActiveQuote = false;
    this.banker.isActiveQuote = false;
  }
  showDetail(data: any) {
    this.isActive = true;
    this.data = data;
    this.titleService.quote.next(true);
    removeDoubleScroll()
    const transactionId = {
      "transactionId": data.transactionId
    }

    this.nts.getSpecificTxnDetailByTxnId(transactionId).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response)).data;
        this.viewData=this.detailInfo;
        if(this.viewData.lcProForma==null || this.viewData.lcProForma=="" || this.viewData.lcProForma==undefined){
          this.noFileDisable=false;
          this.viewDisable=true;
    
         }else{
          this.viewDisable=false;
          this.noFileDisable=true;
         }
      }, (error) => {
        this.hasNoRecord = true;
      }
    )

  }

  

  close() {
    $('#myModalAttach').hide();
  }

  showQuotePage(pagename: string, action: Tflag, val: any) {

    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    removeDoubleScroll()
    const data = {
      "bankUserId": sessionStorage.getItem('userID'),
      "userId": val.userId,
      "transactionId": val.transactionId,
      "requirementType": val.requirementType,
      "lCIssuanceBank": val.lCIssuanceBank,
      "lCValue": val.lCValue,
      "lCCurrency": val.lCCurrency,
      "usanceDays": val.usanceDays,
      "insertedDate": this.date,
      "insertedBy": sessionStorage.getItem('userID'),
      "modifiedDate": this.date,
      "modifiedBy": sessionStorage.getItem('userID'),
      "quotationId": val.quotationId,
      "confirmationPeriod": val.confirmationPeriod,
      "discountingPeriod": val.discountingPeriod,
      "refinancingPeriod": val.refinancingPeriod,


    }

    if (pagename == 'confirmation' || pagename === 'Confirmation') {
       this.confirmation.action(true, action, data);
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'discounting' || pagename === 'Discounting') {

      this.confirmation.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
      this.discounting.action(true, action, data);
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
      this.confirmAndDiscount.action(true, action, data);
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.refinancing.action(true, action, data);
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'banker' || pagename === "Banker" || pagename === 'Banker’s Acceptance') {
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.action(true, action, data);
    }
  }


}
