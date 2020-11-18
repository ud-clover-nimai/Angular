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
import * as $ from '../../../../assets/js/jquery.min';

@Component({
  selector: 'app-draft-transaction',
  templateUrl: './draft-transaction.component.html',
  styleUrls: ['./draft-transaction.component.css']
})
export class DraftTransactionComponent implements OnInit {
  
  noData: boolean = false;
  draftData: any;
  public parentURL: string = "";
  public checkExpAcp:string = "";

  public subURL: string = "";

  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  quotation_id: any;
  constructor(public service: UploadLcService,public titleService: TitleService, public nts: NewTransactionService) {
    this.titleService.quote.next(false);
 
  }
  
  ngOnInit() {
   
  }

  ngAfterViewInit() {
    this.callAllDraftTransaction();
    this.confirmation.isActiveQuote = false;
    this.confirmAndDiscount.isActiveQuote = false;
    this.discounting.isActiveQuote = false;
    this.refinancing.isActiveQuote = false;
    this.banker.isActiveQuote = false;
    
  }

  callAllDraftTransaction(){
    const param = {
    "bankUserId":sessionStorage.getItem('userID')
    }
    
   this.service.getBankDraftQuotation(param).subscribe(
      (response) => {
        this.draftData = JSON.parse(JSON.stringify(response)).data;
        bankNewTransaction();
        if(!this.draftData){
          this.noData = true;
        }
     
      },(error) =>{
        this.noData = true;
      }
      )
  }



  editDraft(pagename: string,action:Tflag,data:any) {
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
 this.quotation_id=data.quotationId;
   const param= {
      "userId":data.userId,
      "transactionId":data.transactionId,
      }
    
    this.service.checkAcceptedExpiredTransaction(param).subscribe(
      (response) => {
        this.checkExpAcp = JSON.parse(JSON.stringify(response)).status;

      
        if(this.checkExpAcp =="Success"){
     
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
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
      this.confirmAndDiscount.action(true, action, data);
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.refinancing.action(true, action, data);
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'banker' || pagename === "Banker" || pagename === 'Banker’s Acceptance') {
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.action(true, action, data);
    }
  }
  
  if(this.checkExpAcp=="Failure"){
    $("#discardQuote").show(); 
    
    }
  });
}


cancelDiscard(){
  $("#discardQuote").hide(); 
}
  deleteDraft(data){
    if(data){
      var req = {
        "quotationId": data.quotationId
        }
    }else{
      
      var req = {
        "quotationId": this.quotation_id
        }
    }
   
    this.service.deleteDraftQuotationByQuotationId(req).subscribe(
      (response) => {
        const index = this.draftData.indexOf(data);
        this.draftData.splice(index, 1);
        $("#discardQuote").hide(); 

      },(error) =>{
      }
      )

  }

}
