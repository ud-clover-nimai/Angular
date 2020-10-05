import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { Tflag } from 'src/app/beans/Tflag';
import { bankActiveTransaction } from 'src/assets/js/commons';
import { ConfirmationComponent } from '../newTransaction/quotes/confirmation/confirmation.component';
import { ConfirmAndDiscountComponent } from '../newTransaction/quotes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from '../newTransaction/quotes/refinancing/refinancing.component';
import { DiscountingComponent } from '../newTransaction/quotes/discounting/discounting.component';
import { BankerComponent } from '../newTransaction/quotes/banker/banker.component';
import * as $ from 'src/assets/js/jquery.min';


@Component({
  selector: 'app-active-transaction',
  templateUrl: './active-transaction.component.html',
  styleUrls: ['./active-transaction.component.css']
})
export class ActiveTransactionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime', 'validity', 'ib', 'amount', 'ccy', 'goodsTypes', 'requirement', 'receivedQuotes', 'star'];
  dataSource: MatTableDataSource<any>;
  public ntData: any[] = [];
  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public hasNoRecordQuote:boolean=false;
  detail: any;
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  public specificDetail: any = "";
  quotationdata: any;
  isDetailActive: boolean=false;
  document: any;
  constructor(public titleService: TitleService, public nts: NewTransactionService) {

    this.titleService.quote.next(false);

  }

  public getAllnewTransactions() {
    const data = {
      "bankUserId": sessionStorage.getItem('userID'),
      "quotationStatus": "Placed"
    }

    this.nts.getTransQuotationDtlByBankUserIdAndStatus(data).subscribe(
      (response) => {
        bankActiveTransaction();
        this.detail = JSON.parse(JSON.stringify(response)).data;
      
        if (!this.detail) {
          this.hasNoRecord = true;
        }

      }, (error) => {
        this.hasNoRecord = true;
      }
    )
  }

  ngOnInit() {
  }
  showProForma(file) {
    $('#myModal99').show();
    this.document = file;
  }
  getDetail(detail:any) {
    this.isDetailActive = true;
    this.hasNoRecordQuote = true;

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
  

      $('.activeTab').removeClass('active');
      $('#menu-barDetailActive li:first').addClass('active');
      $('.tab-content #pill111').addClass('active');
    
   
  }

  ngAfterViewInit() {
    this.getAllnewTransactions();
    this.confirmation.isActive = false;
    this.confirmAndDiscount.isActive = false;
    this.discounting.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;

  }

  showQuotePage(pagename: string, action: Tflag, data: any) {
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;

    if (pagename === 'confirmation' || pagename === 'Confirmation') {
      this.confirmation.action(true, action, data);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActive = false;
      this.discounting.action(true, action, data);
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
      this.confirmAndDiscount.action(true, action, data);
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.action(true, action, data);
      this.banker.isActive = false;
    } else if (pagename === 'banker' || pagename === 'Banker' || pagename === 'Banker’s Acceptance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.action(true, action, data);
    }
  }
}
