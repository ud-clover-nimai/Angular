import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from 'src/assets/js/jquery.min';
import { Tflag } from 'src/app/beans/Tflag';
import { PlaceQuote, editViewQuotation } from 'src/app/beans/BankNewTransaction';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras,ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-refinancing',
  templateUrl: './refinancing.component.html',
  styleUrls: ['./refinancing.component.css']
})
export class RefinancingComponent implements OnInit {

  public isActive: boolean = false;
  public isActiveQuote:boolean=false;
  public data: PlaceQuote;
  public dataViewEdit:editViewQuotation;
  public title: string = "";
  public tab = 'tab1';
  public errmessage:string="";

  detail:any;
  val:any;
  public parentURL: string = "";
  public subURL: string = "";
  
 constructor(public titleService: TitleService, public ts: NewTransactionService, 
  public upls: UploadLcService,public activatedRoute: ActivatedRoute, public router: Router) {
 this.activatedRoute.parent.url.subscribe((urlPath) => {
   this.parentURL = urlPath[urlPath.length - 1].path;
 });
 this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
   this.subURL = urlPath[urlPath.length - 1].path;
 })  
    this.data = {        
      transactionId: "",
      userId: "",
      bankUserId: "",
      quotationId:"",
      confirmationCharges:0,
      confChgsIssuanceToNegot: "",
      confChgsIssuanceToexp: "",
      confChgsIssuanceToMatur: "",
      discountingCharges:0,
      refinancingCharges: "",
      bankAcceptCharges: "",
      applicableBenchmark:0,
      commentsBenchmark: "",
      negotiationChargesFixed:0,
      negotiationChargesPerct:0,
      docHandlingCharges:0,
      otherCharges:0,
      minTransactionCharges:0,
      insertedBy: "",
      modifiedBy: "",
      insertedDate: null,
      modifiedDate:null,
      validityDate:null,
      TotalQuote: 0,
      expiryDays: 0,
      maturityDays: 0,
      negotiationDays: 0,
      sumOfQuote: 0 ,
      confChgsMatur: 0,
      confChgsNegot:0   
        }
  
this.dataViewEdit={
  acceptedOn:null,
		applicableBenchmark:0,
		applicantName:"",
		bankUserId:"",
		bankerAcceptCharges: 0,
		beneName:"",
		chargesType:"",
		commentsBenchmark:"",
		confChgsIssuanceToExp: "",
		confChgsIssuanceToMatur:"",
		confChgsIssuanceToNegot: "",
		confirmationCharges: 0,
		discountingCharges: 0,
		docHandlingCharges: 0,
		goodsType: "",
		lCIssuanceBank: "",
		lCValue: 0,
		minTransactionCharges: 0,
		negotiationChargesFixed: 0,
		negotiationChargesPerct: 0,
		otherCharges: 0,
		quotationId: 0,
		quotationPlaced: "",
		refinancingCharges: 0,
		requirementType: "",
		totalQuoteValue: 0,
		transactionId: "",
		transactionStatus: "",
		userId: "",
		validity: null,
		validityDate: null,
}
      }

  ngOnInit() {
  }

  public action(flag: boolean, type: Tflag, data: any) {
        if (flag) {
      if (type === Tflag.VIEW) {
        this.isActive = flag;
        $('input').attr('readonly', true);
        this.title = 'View';
        this.dataViewEdit = data;
      } else if (type === Tflag.EDIT) {
        this.isActive = flag;
        this.title = 'Edit';
        this.dataViewEdit = data;
        $('input').attr('readonly', false);
      }else if(type===Tflag.PLACE_QUOTE){
        this.isActiveQuote = flag;
        this.title = 'Place Quote';
        this.data = data;
        $('input').attr('readonly', false);
      }

    } else {
      this.isActive = flag;
      this.data = data;
      this.title = '';
      $('input').attr('readonly', true);

    }
  }

  public closed() {
    this.isActive = false;
    this.titleService.quote.next(false);
  }
  public closedQuote() {
    this.isActiveQuote = false;
    this.titleService.quote.next(false);
  }


  public transaction(act: string) {

    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        setTimeout(() => {
          $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'submit': {
        this.ts.updateBankTransaction(this.dataViewEdit).subscribe(
          (response) => {
            this.tab = 'tab3';
          },
          error => {
            alert('error')
            this.closedQuote();
            this.tab = 'tab1';
          }
        )
      }
        break;
      case 'ok': {
            this.closed();
            this.tab = 'tab1';                  
      }
        break;
      case 'preview': {
        this.tab = 'tab2';
        setTimeout(() => {
          $('input').attr('readonly', true);
        }, 200);
       
      }
        break;
    }
  }
  
    
  redirectToactive(){
    const navigationExtras: NavigationExtras = {
      state: {
        redirectedFrom: "confirmation",
        trnsactionID: "data.transactionId"
      }
    };
     this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`], navigationExtras)
     .then(success => console.log('navigation success?', success))
     .catch(console.error);
  }
  public transactionForQuotes(act: string,data:any,detail:any) {
    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        setTimeout(() => {
          $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'confirm': {
        const param = {
                      "quotationId":detail.quotationId,
                      "transactionId":data.transactionId,
                      "userId":data.userId
         }
      
        this.ts.confirmQuotation(param).subscribe(
          (response) => {
            this.tab = 'tab3';
            let emailBodyUpdate = {
              "transactionid": data.transactionId,
              "userId": data.userId,
              "event": "QUOTE_ACCEPT"
              }
              let emailBankBody = {
              
                "event": "QUOTE_ACCEPT_ALERT_ToBanks",
                "quotationId" : detail.quotationId,
                "transactionId" : data.transactionId,
                "bankEmail" : sessionStorage.getItem('custUserEmailId')
                }
            this.upls.confirmLcMailSent(emailBodyUpdate).subscribe((resp) => {console.log("Email sent successfully");},(err) => {},);
            
            this.upls.confirmLcMailSentToBank(emailBankBody).subscribe((resp) => {console.log("bank mail sent successfully");},(err) => {},);
   
          },
          error => {
            alert('error')
            this.closedQuote();
            this.tab = 'tab1';
          }
        )}
  
        break;
      case 'ok': {
           this.closedQuote();
           this.tab = 'tab1';
           const navigationExtras: NavigationExtras = {
            state: {
              redirectedFrom: "refinancing",
              trnsactionID: data.transactionId
            }
          };
           this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`], navigationExtras)
           .then(success => console.log('navigation success?', success))
           .catch(console.error);
              }
        break;
      case 'preview': {
        this.tab = 'tab2';
        setTimeout(() => {
          $('input').attr('readonly', true);
        }, 200);
      }
        break;

case 'calculateQuote':{
  this.ts.saveQuotationToDraft(this.data).subscribe(
    (response) => {
      this.detail = JSON.parse(JSON.stringify(response)).data;
      this.data=data;
      this.data.TotalQuote=this.detail.TotalQuote;
    },
    error => {
      alert('error')
      this.closedQuote();
      this.tab = 'tab1';
    }
  )
}break;
case 'generateQuote': { 
  this.tab = 'tab2';
          this.ts.saveQuotationToDraft(this.data).subscribe(
            (response) => {
              if(JSON.parse(JSON.stringify(response)).status==='Failure'){
                this.errmessage=`Quotation has already Accepted by the Customer for the transaction : ${this.data.transactionId}`
                $("#labRef").text(this.errmessage);
                document.getElementById("myModalRef").style.display = "block";    
              }
              else{    
              this.detail = JSON.parse(JSON.stringify(response)).data;
              this.data=data;
              this.data.TotalQuote=this.detail.TotalQuote;
              this.data.confChgsMatur=this.detail.confChgsMatur;
              this.data.confChgsNegot=this.detail.confChgsNegot;
            
              }           
            },
    error => {
      alert('error')
      this.closedQuote();
      this.tab = 'tab1';
    }
  )
}
}

}


}