import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationComponent } from '../transactionTypes/confirmation/confirmation.component';
import { DiscountingComponent } from '../transactionTypes/discounting/discounting.component';
import { ConfirmAndDiscountComponent } from '../transactionTypes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from '../transactionTypes/refinancing/refinancing.component';
import { BankerComponent } from '../transactionTypes/banker/banker.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from '../../../../assets/js/jquery.min'
import { Tflag } from 'src/app/beans/Tflag';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';


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
  public ntData: any[] = [];
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public detail: any;
  QRdetail: any = "";
  noQRdetail: boolean = false;
  getSpecificDetail: any = "";
  quotationReqType: string;
  lCCurrencyReq:string;
  acceptedDetails: any = "";
  public parentURL: string = "";
  public subURL: string = "";
  acceptedErrorDetail: any;
  acceptedQuoteMessage:any;
  detailInfo: any;
  public unlock :string="";
  noOfQR: any;  
  goodsArray: any;
  subsidiaries: any;
  usercode: any;
  selectedSub: any;
  disablesubsi: boolean=false;
  disableForBC: boolean=true;
  disableUserCode: boolean=false;
  accountType: string;
  selectedUCode: string="";

  constructor(public titleService: TitleService,public psd: PersonalDetailsService,public loginService: LoginService, public nts: NewTransactionService, public bds: BusinessDetailsService, public router: Router, public activatedRoute: ActivatedRoute) {
    //this.titleService.quote.next(false);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });
    this.titleService.quote.next(false);

  }

  public getAllnewTransactions(userid) {
   
    this.titleService.quote.next(true);
    var userIdDetail = sessionStorage.getItem('userID');
  
    var emailId = "";
    emailId = sessionStorage.getItem('branchUserEmailId');

    if(userIdDetail.startsWith('BC')){
      this.disablesubsi=true;
    }
    if(this.selectedUCode){
      emailId=this.selectedUCode;
    }

  const data ={
    "branchUserEmail": emailId,
    "transactionStatus": "Active",
    "userId": userid
  }

    this.nts.getTxnForCustomerByUserIdAndStatus(data).subscribe(
      (response) => {
        custTrnsactionDetail();
        this.detail=[];
        this.detail = JSON.parse(JSON.stringify(response)).data;
      if(this.accountType=='MASTER' && userIdDetail.startsWith('CU')){
        this.disablesubsi=true
        this.disableUserCode=true
      }     
      else  if (this.accountType=='MASTER' && userIdDetail.startsWith('BC')){
        this.disablesubsi=false
        this.disableUserCode=true
      }
      else if(this.accountType=='SUBSIDIARY' && userIdDetail.startsWith('CU')){
        this.disablesubsi=false
        this.disableUserCode=true
      }
       else{
        this.disablesubsi=false
        this.disableUserCode=false
      }
     
      },(error) =>{
        this.hasNoRecord = true;
      }
    )
    this.getUsercodeData(userid)
this.selectedUCode="";
  }

  ngOnInit() {     
    
    this.accountType=sessionStorage.getItem('accountType')
     this.goodsService();
 // this.getUsercodeData();
  this.getSubsidiaryData();
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

 
  getSubsidiaryData(){
    const data = {
      "userId": sessionStorage.getItem('userID'),
    }
    this.psd.getSubUserList(data).
      subscribe(
        (response) => {
          this.subsidiaries = JSON.parse(JSON.stringify(response)).list;
        
        },
        (error) => {}
      )
  }
  getUsercodeData(userid){
    const data={
      "userId": userid,
      "branchUserEmail":this.selectedUCode
    }
    this.psd.getbranchUserList(data).
      subscribe(
        (response) => {
          this.usercode = JSON.parse(JSON.stringify(response)).list;
               

        },
        (error) => {}
      )
  }

  ngAfterViewInit() {
    this.selectedSub=sessionStorage.getItem('userID');

    this.getAllnewTransactions(this.selectedSub);
    this.confirmation.isActive = false;
    this.discounting.isActive = false;
    this.confirmAndDiscount.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;
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
      this.confirmation.action(true,action,this.detailInfo,this.goodsArray,val.validity);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-con").style.width = "520px"; 
    } else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActive = false;
      this.discounting.action(true,action,this.detailInfo,this.goodsArray,val.validity);
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-dis").style.width = "520px"; 
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.action(true,action,this.detailInfo, this.goodsArray,val.validity);
      this.refinancing.isActive = false;
      this.banker.isActive = false;
      document.getElementById("menu-bar-conAndDis").style.width = "520px"; 
    } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.action(true,action,this.detailInfo, this.goodsArray,val.validity);
      this.banker.isActive = false;
      document.getElementById("menu-bar-ref").style.width = "520px"; 
    } else if (pagename === 'Banker’s Acceptance' || pagename === 'Banker' || pagename === 'banker') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.action(true,action,this.detailInfo,this.goodsArray,val.validity);
      document.getElementById("menu-bar-bank").style.width = "520px";  
    }
  },
  (error) => { }
)
  }

  showQuoteDetail(transactionId,requirementType,lCCurrency){
    this.disablesubsi=false;
    this.disableUserCode=false;
  
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
  
    let param = {
      "userId": sessionStorage.getItem('userID'),
      "transactionId": detail.transactionId,
      "quotationId":detail.quotationId
    }
    this.nts.getConfChargesForQuoteAmount(param).subscribe((response)=>{

      var str = JSON.parse(JSON.stringify(response)).status; 
      var splittedNego = str.split(",", 1); 
      var nego=splittedNego[0].split(":", 2)
      this.getSpecificDetail.confChgsIssuanceToNegot=nego[1];

      var splittedMature = str.split(" ", 2); 
      var mature=splittedMature[1].split(":", 2)
      this.getSpecificDetail.confChgsIssuanceToMatur=mature[1];

    });
 
    this.getSpecificDetail.confChgsIssuanceToNegot
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
          this.acceptedQuoteMessage=acceptQuoteResp.status
          if(acceptQuoteResp.status.toLowerCase() == "failure"){
            $('.acceptedErrorDetails').show();
            this.acceptedErrorDetail = acceptQuoteResp.errMessage;
          }
          else{
            $('.acceptedPopupDetails').show();
            $('#TransactionDetailDiv tr:eq(' + index +') td:eq(2)').html(this.acceptedDetails.bankName + ' - ' + this.acceptedDetails.branchName + ', '+ this.acceptedDetails.countryName);
            $('#TransactionDetailDiv tr:eq(' + index +') td:eq(6)').html("Accepted");
          }
        },
        (err) => {
          console.log("Failure");
        }
      )
    
 }

 redirectAsAccepted(){
  this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/transaction-details"]);
 }


// selectSubsidiaries(val){
//     if(val!="none"){
//       this.selectedSub=val;
//     }
// }

selectSubsidiaries(val: any) {
  
      this.selectedSub=val;
      this.getAllnewTransactions(this.selectedSub)
  }
  selectUsercode(val: any) {
    console.log(val)
    this.selectedUCode=val;
    this.selectedSub=""
    this.getAllnewTransactions(this.selectedSub)
}
}