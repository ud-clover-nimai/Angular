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
  public isActive: boolean = false;
  quotationdata: any;
  public quotes:any;
  document: any = "";
  selectReason: any;
  public parentURL: string = "";
  public subURL: string = "";
  acceptedStatus: boolean = true;
  rejectedStatus:boolean=true;
  expiredStatus :boolean=true;

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
      this.rejectedStatus=false;
      this.acceptedStatus = false;
      this.expiredStatus=true;
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
    
      this.quotationdata = detail;
      this.specificDetail = detail;
    if(status=='Accepted'){
      $('.active').removeClass('active');
      $('#menu-barnew li:first').addClass('active');
      $('.tab-content #pill111').addClass('active');
    }else if(status=='Rejected'){
      $('.active').removeClass('active');
      $('#menubarDetailreject li:first').addClass('active');
      $('.tab-content #pill112').addClass('active');
    }else if(status=='Expired'){  
      $('.active').removeClass('active');   
      $('#menuDetailexpired li:first').addClass('active');
      $('.tab-content #pill113').addClass('active');
    }
  
  }
  getQuotes(val){
const data = {
  "transactionId": val.transactionId,
 }
    this.nts.getQuotationOfAcceptedQuote(data).subscribe(
      (response) => {
      console.log(response)
      this.quotes=JSON.parse(JSON.stringify(response)).data;

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
      document.getElementById("menu-barnew").style.width = "450px";
    } else if (status === "Rejected") {
      document.getElementById("menubarDetailreject").style.width = "450px";
    } else if (status === "Expired") {
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

  rejectBankQuote(quoteId,statusReason) {

    $('#myModal5').hide();
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
} 