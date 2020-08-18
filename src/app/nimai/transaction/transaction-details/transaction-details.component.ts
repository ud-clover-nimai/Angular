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
  displayedColumns: string[] = ['id','txnID', 'dateTime', 'lcBank', 'requirement', 'lCValue', 'goods','applicantName', 'beneName', 'status', 'detail1', 'detail2'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public data: any;
  public specificDetail: any = "";
  quotationdata: any;
  document: any;
  public parentURL: string = "";
  public subURL: string = "";
  dataSourceLength: boolean = false;

  constructor(public titleService: TitleService, public nts: NewTransactionService, public activatedRoute: ActivatedRoute, public router: Router, public upls: UploadLcService ) {
    this.titleService.quote.next(false);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
  }

  ngOnInit() {
    custTrnsactionDetail();
    this.getAllnewTransactions('Accepted');
  }

  public getAllnewTransactions(status) {
    var userIdDetail = sessionStorage.getItem('userID');
    var emailId = "";
    if(userIdDetail.startsWith('BC')){
      emailId = sessionStorage.getItem('branchUserEmailId');
    }
    const data = {
      "userId": sessionStorage.getItem('userID'),
      "transactionStatus": status,
      "branchUserEmail":emailId
    }
    this.nts.getAllNewTransaction(data).subscribe(
      (response) => {
        this.data = [];
        this.data = JSON.parse(JSON.stringify(response)).data;
        console.log(this.data);
        
        if(!this.data){
          this.dataSourceLength = true;
        }
        else{
          this.dataSourceLength = false;
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        
        
      },
      (error) => {
        this.dataSourceLength = false;

      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDetail(detail){
    // $("#menu-barnew li").removeClass("active");
    // $("#menu-barnew li:first").addClass("active");
    console.log(detail);
    this.specificDetail = detail;
    
  }

  changeStatusCall(status){
    this.getAllnewTransactions(status);
    custTrnsactionDetail();
    setTimeout(() => {
      if(status == "Rejected"){
        $('#changeStatus').val('Close').change();
      }
    }, 800);
    
  }

  displayQuoteDetails(transactionId){
    let data = {
      "userId": sessionStorage.getItem('userID'),
      "transactionId": transactionId
    }
    
    this.nts.getAllQuotationDetails(data).subscribe(
        (response) => {
          this.quotationdata = JSON.parse(JSON.stringify(response)).data[0];
        console.log(this.quotationdata);
        },
        (error) => {}
    )
  }

  openOffcanvas() {
    document.getElementById("menu-barnew").style.width = "450px"; 
 }
 openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";  
 }
 closeOffcanvas() {
    document.getElementById("menu-barnew").style.width = "0%"; 
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

rejectBankQuote(quoteId, transactionID){
  var statusReason = $("#rejectReason option:selected").text();
  let data = {
    "statusReason" : statusReason
    }
  let emailBody = {
    "transactionid": transactionID,
    "userId": sessionStorage.getItem('userID'),
    "event": "LC_REJECT"
    }
  
  this.nts.custRejectBankQuote(data, quoteId).subscribe(
      (response) => {
        this.upls.confirmLcMailSent(emailBody).subscribe((resp) => {console.log("mail sent successfully");},(err) => {},);

        this.getAllnewTransactions('Rejected');
        custTrnsactionDetail();
        this.closeOffcanvas();
        $('#addOptions select').val('Rejected').change();
      },
      (err) => {}
  )
}

cloneTransaction(transactionId){
  
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

reOpenTransaction(transactionId){
  if($('#addOptions select').val() == "Rejected"){
  var data = {
    "transactionId":transactionId,
    "userId":"CU1313"
    }
    this.nts.custReopenTransaction(data).subscribe(
      (response) => {
        this.openNav3();
        $('#reOpenPopup').show();

      },
      (err) => {}
  )
  }
}

redirectAsReopen(){
  $('#reOpenPopup').hide();
  this.closeOffcanvas();
  this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/active-transaction"]);
 }


}