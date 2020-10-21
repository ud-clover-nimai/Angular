import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-trasaction-details',
  templateUrl: './trasaction-details.component.html',
  styleUrls: ['./trasaction-details.component.css']
})
export class TrasactionDetailsComponent {

  public ntData: any[] = [];
  public accepted: boolean = false;
  public rejected: boolean = false;
  public expired: boolean = false;
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public data: any;
  public specificDetail: any = "";
  quotationdata: any;
  public isActive: boolean = false;
  public quotes:any;
  document: any = "";
  selectReason: any;
  public parentURL: string = "";
  public subURL: string = "";
  acceptedStatus: boolean = true;
  rejectedStatus:boolean=true;
  expiredStatus :boolean=true;
  forCloseTransactionId: any = "";
  forCloseUserId: any;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  public rejectReason:string="";

  constructor(public titleService: TitleService, public nts: NewTransactionService, 
    public activatedRoute: ActivatedRoute, public router: Router) {
      this.activatedRoute.parent.url.subscribe((urlPath) => {
        this.parentURL = urlPath[urlPath.length - 1].path;
      });
      this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
        this.subURL = urlPath[urlPath.length - 1].path;
      });
    this.titleService.quote.next(false);
  }

  ngOnInit() {
    this.getAllnewTransactions('Accepted');

  }
  refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/transaction-details`]);
  });
  }

  rejectedReasons(reason){
    this.rejectReason=reason;
  }

  public getAllnewTransactions(status) {
    
    if(status == "Accepted") {
      this.rejectedStatus=false;
      this.acceptedStatus = true;
      this.expiredStatus=false;
    }
    else  if (status == "Rejected") {
      this.rejectedStatus=true;
      this.acceptedStatus = false;
      this.expiredStatus=false;
    }
    else if(status == "Expired") {
      this.expiredStatus=true;
      this.rejectedStatus=false;
      this.acceptedStatus = false;
    }

    const data = {
      "bankUserId": sessionStorage.getItem('userID'),
      "quotationStatus": status

    }
 
    this.nts.getTransQuotationDtlByBankUserIdAndStatus(data).subscribe(
      (response) => {
        custTrnsactionDetail();
        this.data =[];
        this.data = JSON.parse(JSON.stringify(response)).data;
         if (this.data) {
         this.hasNoRecord=true;
         this.getDetail(this.data,status);
        
      }

      },
      (error) => {
        this.data = null;
       this.hasNoRecord = false;

      }
    )
  }

  getDetail(detail,status) {
    if(detail.lcProforma==null || detail.lcProforma=="" || detail.lcProforma==undefined){
      this.noFileDisable=false;
      this.viewDisable=true;

     }else{
      this.viewDisable=false;
      this.noFileDisable=true;
     }
      this.quotationdata = detail;
     
      this.specificDetail = detail;
      if(this.quotationdata.termConditionComments=='null'){
        this.quotationdata.termConditionComments='';
      } if(this.quotationdata.chargesType=='null'){
        this.quotationdata.chargesType='';
      } if(this.quotationdata.commentsBenchmark=='null'){
        this.quotationdata.commentsBenchmark='';
      }
  

    if(status=='Accepted'){
      $('.activeTab').removeClass('active');
      $('#menu-barDetailnew li:first').addClass('active');
      $('.tab-content #pill111').addClass('active');
    }
    else if(status=='Rejected'){
      $('.activeTab').removeClass('active');
      $('#menubarDetailrejected li:first').addClass('active');
      $('.tab-content #pill112').addClass('active');
    }
    else if(status=='Expired'){  
      $('.activeTab').removeClass('active');   
      $('#menuDetailsExpired li:first').addClass('active');
      $('.tab-content #pill1131').addClass('active');
    }
   
  }
  getQuotes(val){
const data = {
  "transactionId": val.transactionId,
 }
    this.nts.getQuotationOfAcceptedQuote(data).subscribe(
      (response) => {
          if(JSON.parse(JSON.stringify(response)).data==null){
          this.quotes="";    
            }else{
              this.quotes=JSON.parse(JSON.stringify(response)).data[0];
          }

        
      },
      (error) => {
            }
    )
    
  }

  changeStatusCall(status) {
    this.getAllnewTransactions(status);

  }

  
  openOffcanvas(status) {

    if (status === "Accepted") {
        document.getElementById("menu-barDetailnew").style.width = "510px";
    }else if (status === "Expired") {
      document.getElementById("menuDetailsExpired").style.width = "520px";
    } else if (status === "Rejected") {
      document.getElementById("menubarDetailrejected").style.width = "510px";
    } 

  }
  openNav3() {

    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";
  }
  closeOffcanvas() {
    document.getElementById("menu-barDetailnew").style.width = "0%";
    document.getElementById("menuDetailsExpired").style.width = "0%";
    document.getElementById("menubarDetailrejected").style.width = "0%";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  }
  showProForma(file) {
    $('#myModal91').show();
    this.document = file;
  }
  close() {
    $('#myModal91').hide();
  }

  onSubmit() {
    $("#selectReason").val(null);
  }

  rejectBankQuote(quoteId,statusReason) {

    $('#myModalReject').hide();
    $('.modal-backdrop').hide();
    let data = {
       "userId": sessionStorage.getItem('userID'),
      "statusReason": statusReason
    }
   
    this.nts.custRejectBankQuote(data, quoteId).subscribe(
      (response) => {
        this.closeOffcanvas();
        this.getAllnewTransactions('Rejected');
        $('#addOptions select').val('Rejected').change();

      },
      (err) => { }
    )
  }


  onCloseTransactionPopup(record,val){
    if(val == "Close"){
      $("#closeReasonForQuote").val("");
      $("#closePopupForQuote").show();
      this.openNav3();
      this.forCloseTransactionId = record.transactionId;
      this.forCloseUserId=record.userId;
    }
  }

  onClosePopDismiss(){
    $("#closePopupForQuote").hide();
    this.closeOffcanvas();
    $('#closedStatus'+this.forCloseTransactionId).val("Open").change();
  }



  closedTransaction() {
      var request = {
        "transactionId":this.forCloseTransactionId,
        "userId":this.forCloseUserId,
        "statusReason":$("#closeReasonForQuote").val()
      }
      this.nts.custCloseTransaction(request).subscribe(
        (response) => {
        this.closeOffcanvas();
        $("#closePopupForQuote").hide();
        this.getAllnewTransactions('Accepted');
        custTrnsactionDetail();
        },
        (err) => { }
      )
  }

} 
