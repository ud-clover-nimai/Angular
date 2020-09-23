import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationComponent } from '../transactionTypes/confirmation/confirmation.component';
import { DiscountingComponent } from '../transactionTypes/discounting/discounting.component';
import { ConfirmAndDiscountComponent } from '../transactionTypes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from '../transactionTypes/refinancing/refinancing.component';
import { BankerComponent } from '../transactionTypes/banker/banker.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from '../../../../assets/js/jquery.min'
import { Tflag } from 'src/app/beans/Tflag';
import { custActiveTransaction } from 'src/assets/js/commons';
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-active-transaction',
  templateUrl: './active-transaction.component.html',
  styleUrls: ['./active-transaction.component.css']
})
export class ActiveTransactionComponent implements OnInit { 
  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  detail: any;
  QRdetail: any = "";
  noQRdetail: boolean = false;
  getSpecificDetail: any = "";
  quotationReqType: string;
  lCCurrencyReq:string;
  acceptedDetails: any = "";
  public parentURL: string = "";
  public subURL: string = "";
  acceptedErrorDetail: any;
  detailInfo: any;

  constructor(public titleService: TitleService, public nts: NewTransactionService, public bds: BusinessDetailsService, public router: Router, public activatedRoute: ActivatedRoute) {
    this.titleService.quote.next(false);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

  }

  public getAllnewTransactions() {
    var userIdDetail = sessionStorage.getItem('userID');
    var emailId = "";
    if(userIdDetail.startsWith('BC')){
      emailId = sessionStorage.getItem('branchUserEmailId');
    }
    const data={
      userId:sessionStorage.getItem('userID'),
      "transactionStatus": 'Active',
      "branchUserEmail":emailId
    }
    this.nts.getTxnForCustomerByUserIdAndStatus(data).subscribe(
      (response) => {
        custActiveTransaction();
        this.detail = JSON.parse(JSON.stringify(response)).data;
        if (!this.detail) {
          this.hasNoRecord = true;
        }
        else{
          this.hasNoRecord = false;
        }
      },(error) =>{
        this.hasNoRecord = true;
      }
    )
  }

  ngOnInit() {
   // this.paginator._intl.itemsPerPageLabel="Transactions per page";
    //custActiveTransaction();
      $('#TransactionDetailDiv').hide();
      $('.acceptedPopupDetails').hide();
      $('.acceptedErrorDetails').hide();
      $('#backbtn').hide();

      $('#backbtn').click(function () {
          $('#changetext').html('Active Transactions');
          $('#TransactionDetailDiv').slideUp();
          $('#transactionID').slideDown();
          $('#TransactionDetailDiv').hide();
          $('#transactionFilter').show();
          $('#backbtn').fadeOut();
  });
  }

  ngAfterViewInit() {
    this.confirmation.isActive = false;
    this.discounting.isActive = false;
    this.confirmAndDiscount.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;
    this.getAllnewTransactions();
  }



   showQuotePage(pagename: string,action:Tflag,val:any) {
    
    let data = {
      "transactionId": val.transactionId,
    }
    this.nts.getSpecificTxnDetailByTxnId(data).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response)).data;
        
     
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
    if (pagename === 'confirmation' || pagename === 'Confirmation' ) {
      this.confirmation.action(true,action,this.detailInfo);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-con").style.width = "500px"; 
    } else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActive = false;
      this.discounting.action(true,action,this.detailInfo);
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-dis").style.width = "500px"; 
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.action(true,action,this.detailInfo);
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-conAndDis").style.width = "500px"; 
    } else if (pagename === 'refinance' || pagename === 'Refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.action(true,action,this.detailInfo);
      this.banker.isActive = false;
      document.getElementById("menu-bar-ref").style.width = "500px"; 
    } else if (pagename === 'banker' || pagename === 'Banker') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.action(true,action,this.detailInfo);
      document.getElementById("menu-bar-bank").style.width = "500px";  
    }
  },
  (error) => { }
)
  }

  showQuoteDetail(transactionId,requirementType,lCCurrency){
    $('#changetext').html('Bank Quotes');
    $('#transactionID').slideUp();
    $('#TransactionDetailDiv').slideDown();
    $('#transactionFilter').hide();
    $('#backbtn').fadeIn();
    this.noQRdetail = false;

    let data = {
      "userId": sessionStorage.getItem('userID'),
      "transactionId": transactionId
    }
    this.nts.getAllQuotationDetails(data).subscribe(
      (response) => {
        this.QRdetail = JSON.parse(JSON.stringify(response)).data;
        this.quotationReqType =requirementType;
        this.lCCurrencyReq=lCCurrency;
          this.QRdetail = this.QRdetail.map(item => ({
          ...item,
          isSelected: false
        }));
        if(!this.QRdetail){
          this.noQRdetail = true;
        }
        
      },(error) =>{
      }
    )
  }

  openOffcanvas(act) {
    if(act=='quote'){
      document.getElementById("menu-barnew").style.width = "500px";
    }
    }
   
 openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";  
 }
 closeOffcanvas() {
    document.getElementById("menu-barnew").style.width = "0%"; 
    document.getElementById("menu-bar-con").style.width = "0%"; 
    document.getElementById("menu-bar-dis").style.width = "0%"; 
    document.getElementById("menu-bar-conAndDis").style.width = "0%"; 
    document.getElementById("menu-bar-ref").style.width = "0%"; 
    document.getElementById("menu-bar-bank").style.width = "0%";  
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
 } 

  getQRDetail(detail,requirementType,lCCurrency){
    this.getSpecificDetail = detail;    
    this.quotationReqType = requirementType;
    this.lCCurrencyReq=lCCurrency;
 }

 showAcceptedDetails(index,qId, tId, quotationDetails){
  let req = {
    "quotationId": qId,
	  "transactionId": tId
  }

  index = index + 1;

      this.acceptedDetails = quotationDetails;
      
      this.nts.acceptBankQuote(req).subscribe(
        (response) => {          
          var acceptQuoteResp = JSON.parse(JSON.stringify(response));
          if(acceptQuoteResp.status.toLowerCase() == "failure"){
            $('.acceptedErrorDetails').show();
            this.acceptedErrorDetail = acceptQuoteResp.errMessage;
          }
          else{
            $('.acceptedPopupDetails').show();
            $('#TransactionDetailDiv tr:eq(' + index +') td:eq(2)').html(this.acceptedDetails.bankName + ' - ' + this.acceptedDetails.branchName + ', '+ this.acceptedDetails.countryName);
            $('#TransactionDetailDiv tr:eq(' + index +') td:eq(6)').html("Accepted");
          }
          console.log("quote Accepted");
        },
        (err) => {
          console.log("Failure");
        }
      )
    
 }

 redirectAsAccepted(){
  this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/transaction-details"]);
 }
}