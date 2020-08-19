import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { bankNewTransaction, custActiveTransaction } from 'src/assets/js/commons'
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');

  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  public detail: any;
  public test: string = "";


  constructor(public titleService: TitleService, public nts: NewTransactionService, private formBuilder: FormBuilder) {

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
      lcbranch: []
    }
  }
  ngOnInit() {
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
  }

  showProForma(file){
    $('#myModalAttach').show();
    this.document = file;
    }

    close(){
      $('#myModalAttach').hide();
      }

  showQuotePage(pagename: string, action: Tflag, val: any) {

    this.titleService.quote.next(true);
    this.whoIsActive = pagename;

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
    //pagename='refinancing';
   
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
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount') {
      this.confirmAndDiscount.action(true, action, data);
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.refinancing.action(true, action, data);
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'banker' || pagename === "Banker") {
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.action(true, action, data);
    }
  }


}
