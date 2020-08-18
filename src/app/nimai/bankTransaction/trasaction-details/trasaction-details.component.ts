import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { custTrnsactionDetail } from 'src/assets/js/commons';
import * as $ from 'src/assets/js/jquery.min';


@Component({
  selector: 'app-trasaction-details',
  templateUrl: './trasaction-details.component.html',
  styleUrls: ['./trasaction-details.component.css']
})
export class TrasactionDetailsComponent {
  
public ntData: any[] = [];
public accepted: boolean = false;
public rejected: boolean = false;
public expired:boolean=false;
public whoIsActive: string = "";
public hasNoRecord: boolean = false;
public data: any;
public specificDetail: any;
quotationdata: any;
document: any;
selectReason :any={};

constructor(public titleService: TitleService, public nts: NewTransactionService) {
  
  this.titleService.quote.next(false);
}

ngOnInit() {
 
  this.getAllnewTransactions('Accepted');
  
}

public getAllnewTransactions(status) {
  const data = {
    "bankUserId":sessionStorage.getItem('userID'),
    //"quotationPlaced":"Yes",
   // "transactionStatus":status
    "quotationStatus":status

  }

  this.nts.getTransQuotationDtlByBankUserIdAndStatus(data).subscribe(
    (response) => {
     
      custTrnsactionDetail();
        this.data = [];
      this.data = JSON.parse(JSON.stringify(response)).data;
      this.getDetail(this.data)
      if (!this.data) {
         this.hasNoRecord = true;
      }
    },
    (error) => {
      this.data = null;
       this.hasNoRecord = true;

    }
  )
}

getDetail(detail){
  this.quotationdata = detail;
  this.specificDetail = detail;
}

changeStatusCall(status){
  
  this.getAllnewTransactions(status);
 
  
}


openOffcanvas(status) {
  if(status==="Accepted"){
        document.getElementById("menu-barnew").style.width = "450px"; 
      }else if(status==="Rejected"){
        document.getElementById("menubarDetailreject").style.width = "450px"; 
      }else if(status==="Expired"){
        document.getElementById("menuDetailexpired").style.width = "450px"; 
      }

}
openNav3() {
 
  document.getElementById("myCanvasNav").style.width = "100%";
  document.getElementById("myCanvasNav").style.opacity = "0.6";  
}
closeOffcanvas() {
  document.getElementById("menu-barnew").style.width = "0%"; 
  document.getElementById("menuDetailexpired").style.width = "0%"; 
  document.getElementById("menubarDetailreject").style.width = "0%";
  document.getElementById("myCanvasNav").style.width = "0%";
  document.getElementById("myCanvasNav").style.opacity = "0"; 
} 
showProForma(file){
$('#myModal9').show();
this.document = file;
}
close(){
$('#myModal9').hide();
}



rejectBankQuote(quoteId){
 
  $('#myModal5').hide();
$('.modal-backdrop').hide();

let data = {
  "statusReason":"ABC"
  }

this.nts.custRejectBankQuote(data, quoteId).subscribe(
    (response) => {
      this.closeOffcanvas();
      this.getAllnewTransactions('Rejected');
      $('#addOptions select').val('Rejected').change();
      
    },
    (err) => {}
)
}


} 