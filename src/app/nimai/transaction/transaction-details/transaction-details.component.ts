import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';


@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent {
  

  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public data: any;
  public specificDetail: any = "";
  quotationdata: any = "";
  document: any = "";
  selectReason: any;
  public parentURL: string = "";
  public subURL: string = "";
  dataSourceLength: boolean = false;
  quotationReqType: string;
  onReject: boolean = false;
  NotAllowed: boolean = true;
  forCloseTransactionId: any = "";
  showTransactionStatusCol: boolean = true;
  acceptedStatus: boolean = true;
  rejectedStatus:boolean=true;
  expiredStatus :boolean=true;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  public detailInfo: any = "";
  public rejectReason:string=""

  constructor(public titleService: TitleService, public nts: NewTransactionService, public activatedRoute: ActivatedRoute, public router: Router, public upls: UploadLcService) {
    this.titleService.quote.next(false);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
  }

  ngOnInit() {
    this.getAllnewTransactions('Accepted');
  }

  public getAllnewTransactions(status) {

    if (status == "Rejected") {
      this.onReject = true;
      this.NotAllowed = true;
      this.rejectedStatus=true;
      this.acceptedStatus = false;
      this.expiredStatus=false;
    }
    else if(status == "Expired") {
      this.onReject = false;
      this.NotAllowed = false;
      this.expiredStatus=true;
      this.rejectedStatus=false;
      this.acceptedStatus = false;
    }
    else if(status == "Accepted") {
      this.onReject = false;
      this.NotAllowed = true;
      this.rejectedStatus=false;
      this.acceptedStatus = true;
      this.expiredStatus=false;
    }

    var userIdDetail = sessionStorage.getItem('userID');
    var emailId = "";
    if (userIdDetail.startsWith('BC')) {
      emailId = sessionStorage.getItem('branchUserEmailId');
    }
    const data = {
      "userId": sessionStorage.getItem('userID'),
      "transactionStatus": status,
      "branchUserEmail": emailId
    }
    // this.nts.getAllNewTransaction(data).subscribe(
     this.nts.getTxnForCustomerByUserIdAndStatus(data).subscribe(
      (response) => {
        custTrnsactionDetail();
        this.data = [];
        this.data = JSON.parse(JSON.stringify(response)).data;
        
        if (this.data) {
          this.hasNoRecord=true;
        //  this.getDetail(this.data,status,undefined);
       }

      },
      (error) => {
       

      }
    )
  }

  rejectedReasons(reason){
    this.rejectReason=reason;
  }
  getDetail(detail,status,transactionId) {
    this.displayDetails(transactionId);
    this.specificDetail = detail;
  
    if(status=='Accepted'){
      $('.activeTab').removeClass('active');
      $('#menu-barnew li:first').addClass('active');
      $('.tab-content #pill111').addClass('active');

    }
    else if(status=='Rejected'){
      $('.activeTab').removeClass('active');
      $('#menubarDetailreject li:first').addClass('active');
      $('.tab-content #pill112').addClass('active');

    }
    else if(status=='Expired'){  
      $('.activeTab').removeClass('active');   
      $('#menubarDetailexpired li:first').addClass('active');
      $('.tab-content #pill131').addClass('active');

    }
    
    if(detail.lcProForma==null || detail.lcProForma=="" || detail.lcProForma==undefined){
      this.noFileDisable=false;
      this.viewDisable=true;

     }else{
      this.viewDisable=false;
      this.noFileDisable=true;
     }
  }

  changeStatusCall(status) {
    this.getAllnewTransactions(status);
  }

  displayDetails(transactionId){
    let data = {
      "transactionId": transactionId,
    }
    this.nts.getSpecificTxnDetailByTxnId(data).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response)).data;
        // if(this.detailInfo.statusReason=='1'){
        //   this.statusReason="Bank not acceptable";
        
        // }else if(this.detailInfo.statusReason=='2'){
        //   this.statusReason="Bank has rejected the transaction due to non-fulfillment of documentary requirements";
        
        // }else if(this.detailInfo.statusReason=='3'){
        //   this.statusReason="Others";
        
        // }
      },
      (error) => { }
    )
  }

  displayQuoteDetails(transactionId, reqType) {
    let data = {
      "userId": sessionStorage.getItem('userID'),
      "transactionId": transactionId,
      "quotationStatus": $('#addOptions select').val()
    }

    this.nts.getQuotationDetails(data).subscribe(
      (response) => {
        this.quotationdata = "";
        if(JSON.parse(JSON.stringify(response)).data[0])
        this.quotationdata = JSON.parse(JSON.stringify(response)).data[0];       
        this.quotationReqType = reqType;
        if(this.quotationdata.termConditionComments=='null'){
          this.quotationdata.termConditionComments='';
        } if(this.quotationdata.chargesType=='null'){
          this.quotationdata.chargesType='';
        } if(this.quotationdata.commentsBenchmark=='null'){
          this.quotationdata.commentsBenchmark='';
        }

    

      },
      (error) => { }
    )
  }

  openOffcanvas(status) {

    if (status === "Accepted") {
      document.getElementById("menu-barnew").style.width = "540px";
  }else if (status === "Expired") {
    document.getElementById("menubarDetailexpired").style.width = "530px";
  } else if (status === "Rejected") {
    document.getElementById("menubarDetailreject").style.width = "540px";
  } 

  }
  openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";
  }
  closeOffcanvas() {
    document.getElementById("menubarDetailexpired").style.width = "0%";
    document.getElementById("menubarDetailreject").style.width = "0%";
    document.getElementById("menu-barnew").style.width = "0%";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  }
  showProForma(file) {
    $('#myModal9').show();
    this.document = file;
  }
  close() {
    $('#myModal9').hide();
  }
  
  onSubmit() {
    $("#selectReason").val(null);
  }

  rejectBankQuote(quoteId, transactionID,statusReason) {
    $('#myModal5').hide();
    $('.modal-backdrop').hide();

    //var statusReason = $("#rejectReason option:selected").text();
    let data = {
      "userId": sessionStorage.getItem('userID'),
      "statusReason": statusReason
    }
    let emailBody = {
      "transactionid": transactionID,
      "userId": sessionStorage.getItem('userID'),
      "event": "LC_REJECT"
    }

    this.nts.custRejectBankQuote(data, quoteId).subscribe(
      (response) => {
        // this.upls.confirmLcMailSent(emailBody).subscribe((resp) => { console.log("mail sent successfully"); }, (err) => { },);

        this.getAllnewTransactions('Rejected');
        this.closeOffcanvas();
        $('#addOptions select').val('Rejected').change();
      },
      (err) => { }
    )
  }
  refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/transaction-details`]);
  });
  }

  
  cloneTransaction(transactionId) {

    const navigationExtras: NavigationExtras = {
      state: {
        redirectedFrom: "cloneTransaction",
        trnsactionID: transactionId
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }

  reOpenTransaction(transactionId) {
    console.log(transactionId)
    if ($('#addOptions select').val() == "Rejected") {
      var data = {
        "transactionId": transactionId,
        "userId": sessionStorage.getItem('userID'),
      }
      this.nts.custReopenTransaction(data).subscribe(
        (response) => {
          $('#reOpenPopup').hide();
          $('.modal-backdrop').hide();
          this.closeOffcanvas();
          this.router.navigate([`/${this.subURL}/${this.parentURL}` + "/active-transaction"]);
        },
        (err) => { }
      )
    }
  }
  

  onCloseTransactionPopup(record,val){
    if(val == "Close"){
      $("#closeReason").val("");
      $("#closePopup").show();
      this.openNav3();
      this.forCloseTransactionId = record.transactionId;
    }
  }



  onClosePopDismiss(){
    $("#closePopup").hide();
    this.closeOffcanvas();
    $('#closedTrans').val("Open").change();
  }

  closedTransaction() {
      var request = {
        "transactionId":this.forCloseTransactionId,
        "userId":sessionStorage.getItem('userID'),
        "statusReason":$("#closeReason").val()
      }
      this.nts.custCloseTransaction(request).subscribe(
        (response) => {
        this.closeOffcanvas();
        $("#closePopup").hide();
        this.getAllnewTransactions('Accepted');
        custTrnsactionDetail();
        },
        (err) => { }
      )
  }
}