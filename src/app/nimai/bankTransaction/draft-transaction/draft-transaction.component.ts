import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { ConfirmationComponent } from '../newTransaction/quotes/confirmation/confirmation.component';
import { RefinancingComponent } from '../newTransaction/quotes/refinancing/refinancing.component';
import { ConfirmAndDiscountComponent } from '../newTransaction/quotes/confirm-and-discount/confirm-and-discount.component';
import { DiscountingComponent } from '../newTransaction/quotes/discounting/discounting.component';
import { BankerComponent } from '../newTransaction/quotes/banker/banker.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import {bankActiveTransaction,bankNewTransaction} from 'src/assets/js/commons'
import { Tflag } from 'src/app/beans/Tflag';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-draft-transaction',
  templateUrl: './draft-transaction.component.html',
  styleUrls: ['./draft-transaction.component.css']
})
export class DraftTransactionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'beneficiary', 'bcountry', 'applicant', 'acountry', 'txnID', 'dateTime', 'validity', 'ib', 'amount', 'ccy', 'goodsTypes', 'requirement', 'receivedQuotes', 'star'];
  dataSource: MatTableDataSource<any>;
  public ntData: any[] = [];
  noData: boolean = false;
  draftData: any;
  public parentURL: string = "";
  public subURL: string = "";

  
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
  constructor(public service: UploadLcService,public titleService: TitleService, public nts: NewTransactionService) {
    this.titleService.quote.next(false);
 
  }
  
  ngOnInit() {
    bankActiveTransaction();
  }

  ngAfterViewInit() {
    this.callAllDraftTransaction();
    this.confirmation.isActive = false;
    this.confirmAndDiscount.isActive = false;
   this.discounting.isActive = false;
    this.refinancing.isActive = false;
    this.banker.isActive = false;
    
  }

  callAllDraftTransaction(){
    const param = {
    "bankUserId":sessionStorage.getItem('userID')
    }
    
   this.service.getBankDraftQuotation(param).subscribe(
      (response) => {
        this.draftData = JSON.parse(JSON.stringify(response)).data;
        bankNewTransaction();
        console.log(this.draftData);
        if(!this.draftData){
          this.noData = true;
        }
     
      },(error) =>{
        this.noData = true;
      }
      )
  }



  editDraft(pagename: string,action:Tflag,val:any) {
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
   

    if (pagename == 'confirmation' || pagename === 'Confirmation' ) {
      this.confirmation.action(true,action,val);
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActive = false;
      this.discounting.action(true,action,val);
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount') {    
      this.confirmAndDiscount.action(true,action,val);
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.refinancing.isActive = false;
      this.banker.isActive = false;
    } else if (pagename === 'refinancing' || pagename === 'Refinance' || pagename==='refinance') {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.action(true,action,val);
      this.banker.isActive = false;
    } else if (pagename === 'banker' || pagename === "Banker") {
      this.confirmation.isActive = false;
      this.discounting.isActive = false;
      this.confirmAndDiscount.isActive = false;
      this.refinancing.isActive = false;
      this.banker.action(true,action,val);
    }
  }

  deleteDraft(val){
    const index = this.draftData.indexOf(val);
    this.draftData.splice(index, 1);
  }

}
