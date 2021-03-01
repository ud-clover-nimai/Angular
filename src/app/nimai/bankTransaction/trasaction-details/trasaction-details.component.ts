import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';


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
  public withdrawn :boolean=false;
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
  withdrawStatus :boolean=true;
  forCloseTransactionId: any = "";
  forCloseUserId: any;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  public rejectReason:string="";
  isUploadNoDoc: boolean=false;
  tenor: any;
  imgDownload: boolean=false;
  fileData: any;
  selectedSub: any;
  subsidiaries: any;
  currentStatus: any;
  disablesubsi: boolean;
  nimaiCount: any;
  getcountUser: any;
  creditCounts: number;
  creditCount: any;

  constructor(public titleService: TitleService, public getCount: SubscriptionDetailsService,public nts: NewTransactionService,public psd: PersonalDetailsService,
    public activatedRoute: ActivatedRoute, public router: Router) {
      this.activatedRoute.parent.url.subscribe((urlPath) => {
        this.parentURL = urlPath[urlPath.length - 1].path;
      });
      this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
        this.subURL = urlPath[urlPath.length - 1].path;
      });
    this.titleService.quote.next(false);
    this.nts.creditCount.subscribe(ccredit=>{
      this.creditCount=ccredit;
          });
  }

  ngOnInit() {
    this.getAllnewTransactions('Accepted',sessionStorage.getItem('userID'));
    this.getSubsidiaryData();

  }
  getNimaiCount() {
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": ""
    }
    this.getCount.getTotalCount(data).subscribe(
      response => {
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
    this.getcountUser=this.nimaiCount.accounttype;
    this.creditCounts=this.nimaiCount.lc_count-this.nimaiCount.lcutilizedcount;
    this.nts.creditCount.next(this.creditCounts)
    if(this.getcountUser=='MASTER'){
       
      this.disablesubsi=true
    }else{
      this.disablesubsi=false
      
    }
      }
    )
  }
  getSubsidiaryData(){
    const data = {
      "userId": sessionStorage.getItem('userID'),
    }
    this.psd.getAddUserList(data).
      subscribe(
        (response) => {
          this.subsidiaries = JSON.parse(JSON.stringify(response)).list;
        
        },
        (error) => {}
      )
  }
  refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/transaction-details`]);
  });
  }

  rejectedReasons(reason){
    this.rejectReason=reason;
  }

  public getAllnewTransactions(status,userid) {
    this.getNimaiCount();
    if(status == "Accepted") {
      this.rejectedStatus=false;
      this.acceptedStatus = true;
      this.expiredStatus=false;
      this.withdrawStatus=false;
    }
    else  if (status == "Rejected") {
      this.rejectedStatus=true;
      this.acceptedStatus = false;
      this.expiredStatus=false;
      this.withdrawStatus=false;
    }
    else if(status == "Expired") {
      this.expiredStatus=true;
      this.rejectedStatus=false;
      this.acceptedStatus = false;
      this.withdrawStatus=false;
    }
    else if(status == "Withdrawn") {
      this.expiredStatus=false;
      this.rejectedStatus=false;
      this.acceptedStatus = false;
      this.withdrawStatus=true;
    }

    this.currentStatus=status;
    const data = {
      "bankUserId": userid,
      "quotationStatus": this.currentStatus

    }
    this.nts.getTransQuotationDtlByBankUserIdAndStatus(data).subscribe(
      (response) => {
        custTrnsactionDetail();
        this.data =[];
        this.data = JSON.parse(JSON.stringify(response)).data;
         if (this.data) {
         this.hasNoRecord=true;
         this.getDetail(this.data,status,this.data.transactionID);
       
      }

      },
      (error) => {
        this.data = null;
       this.hasNoRecord = false;

      }
    )
  }
  

  getDetail(detail,status,trnxId) {
    console.log(trnxId)

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
      if(this.specificDetail.tenorFile){
        this.isUploadNoDoc=false;
      }else{
        this.isUploadNoDoc=true;
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
    else if(status=='Withdrawn'){  
      $('.activeTab').removeClass('active');   
      $('#menuDetailsWithdrawn li:first').addClass('active');
      $('.tab-content #pill1151').addClass('active');
    }
   
  }

getNegoMature(val){
  const params ={
  
    "quotationId":val.quotationId,
    "transactionId":val.transactionId
  
 }
 this.nts.getTransQuotationDtlByQuotationId(params).subscribe(
  (response) => {
    var str = JSON.parse(JSON.stringify(response)).status; 
    var splittedNego = str.split(",", 1); 
    var nego=splittedNego[0].split(":", 2)
    this.quotationdata.confChgsIssuanceToNegot=nego[1];

    var splittedMature = str.split(" ", 2); 
    var mature=splittedMature[1].split(":", 2)
    this.quotationdata.confChgsIssuanceToMatur=mature[1];
  });
}

  getQuotes(val){
const data = {
  "transactionId": val.transactionId,
 }

 const params ={
  
    "quotationId":val.quotationId,
    "transactionId":val.transactionId
  
 }
 this.nts.getTransQuotationDtlByQuotationId(params).subscribe(
  (response) => {
    var str = JSON.parse(JSON.stringify(response)).status; 
    var splittedNego = str.split(",", 1); 
    var nego=splittedNego[0].split(":", 2)
    this.quotationdata.confChgsIssuanceToNegot=nego[1];

    var splittedMature = str.split(" ", 2); 
    var mature=splittedMature[1].split(":", 2)
    this.quotationdata.confChgsIssuanceToMatur=mature[1];
  });
    this.nts.getQuotationOfAcceptedQuote(data).subscribe(
      (response) => {
          if(JSON.parse(JSON.stringify(response)).data==null){
          this.quotes="";    
            }else{
              this.quotes=JSON.parse(JSON.stringify(response)).data;
              var str = JSON.parse(JSON.stringify(response)).status; 
    var splittedNego = str.split(",", 1); 
    var nego=splittedNego[0].split(":", 2)
    this.quotes.confChgsIssuanceToNegot=nego[1];

    var splittedMature = str.split(" ", 2); 
    var mature=splittedMature[1].split(":", 2)
    this.quotes.confChgsIssuanceToMatur=mature[1];
          }
         
      },
      (error) => {
            }
    )
    
  }

  changeStatusCall(status) {
    this.getAllnewTransactions(status,sessionStorage.getItem('userID'));

  }

  
  openOffcanvas(status) {

    if (status === "Accepted") {
        document.getElementById("menu-barDetailnew").style.width = "510px";
    }else if (status === "Expired") {
      document.getElementById("menuDetailsExpired").style.width = "520px";
    } else if (status === "Rejected") {
      document.getElementById("menubarDetailrejected").style.width = "510px";
    }  else if (status === "Withdrawn") {
      document.getElementById("menuDetailsWithdrawn").style.width = "510px";
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
    document.getElementById("menuDetailsWithdrawn").style.width = "0%";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  }
  showProForma(file) {
    $('#myModal91').show();
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
    var  base64string = data;
    
    var filename=splittedStr[0];
    var ext = filename.split("."); 
    var extension='.'+ext[1];

    if(extension=='.xlsx'){
    var  base64string= base64string.replace('data:application/octet-stream;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type:'application/octet-stream'});
      FileSaver.saveAs(blob, filename);
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
      this.imgDownload=false;

    }  
     else if(extension=='.docx'){
        base64string= base64string.replace('data:application/octet-stream;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        FileSaver.saveAs(blob,filename);
        this.imgDownload=false;

    }
     else if(extension=='.csv'){
            base64string= base64string.replace('data:application/octet-stream;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'text/csv' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=false;

          }
          else if(extension=='.jpeg' || extension=='.jpg' || extension=='.png' || extension=='.svg'){
            base64string= base64string.replace('data:image/jpeg;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/jpeg' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;

          }               
              
              }
              
  openDocument(file){
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
        this.getAllnewTransactions('Rejected',sessionStorage.getItem('userID'));
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
        this.getAllnewTransactions('Accepted',sessionStorage.getItem('userID'));
        custTrnsactionDetail();
        },
        (err) => { }
      )
  }
  selectSubsidiaries(val: any) {
  
    this.selectedSub=val;
    this.getAllnewTransactions(this.currentStatus,this.selectedSub)
}
} 
