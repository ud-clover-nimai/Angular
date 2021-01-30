import { Component, OnInit } from '@angular/core';
import { creditTransaction,        custTrnsactionDetail} from  'src/assets/js/commons';
import { DashboardDetailsService } from 'src/app/services/dashboard-details/dashboard-details.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-credit-and-transactions',
  templateUrl: './credit-and-transactions.component.html',
  styleUrls: ['./credit-and-transactions.component.css']
})
export class CreditAndTransactionsComponent implements OnInit {
 public creditData:any;
 public noData:boolean=false;
  public startDate:any;
  public endDate:any;
  creditUsed:any;
  totalSavings:any;
  public subsidiary:any;
  companyName="";
  constructor(public service: DashboardDetailsService) {
  //  creditTransaction();

   }
  ngOnInit() {
    this.listOfCreditAndTransaction();

    this.startDate=""
    this.endDate=""

  }
   arrUnique(a){
    var t = [];
    for(var x = 0; x < a.length; x++){
      if(t.indexOf(a[x]) == -1)t.push(a[x]);
    }
    return t;
   }
  listOfCreditAndTransaction(){     
    const param = {
      "userid":sessionStorage.getItem('userID'),
      "txnInsertedDate":this.startDate,
      "txnDate":this.endDate,
      "companyName":this.companyName
    }
    this.service.getCreditAndTransactionList(param).subscribe(
      (response) => {
       // creditTransaction();
        custTrnsactionDetail();

        this.creditData=[];
          this.creditData = JSON.parse(JSON.stringify(response)).data;
        if(JSON.parse(JSON.stringify(response)).data){
          
          let total = 0;
          let savings=0;
          this.subsidiary=[]
          for (let i = 0; i < this.creditData.length; i++) {
            let blgData={
              subsidiary:this.creditData[i].companyName
            }
            total +=Number(this.creditData[i].creditUsed);
            savings+=Number(this.creditData[i].savings);
            this.subsidiary.push(this.creditData[i].companyName);
          }
          this.subsidiary=this.arrUnique(this.subsidiary) 
          this.creditUsed=total;
          this.totalSavings=savings;
        }
        // else{
        //   this.creditData=""
        // }  
        // if(this.creditData.length === 0){
        //   this.noData = true;
        // }else{
        //   this.noData=false;
        // }
      },(error) =>{
        this.noData = true;
      }
      )
  }
  changeStartDate(event: MatDatepickerInputEvent<Date>) {    
    let formatedDate  = formatDate(new Date(event.target.value), 'yyyy-MM-dd', 'en'); 
    this.startDate=formatedDate
    this.listOfCreditAndTransaction()
  }
  changeEndDate(event: MatDatepickerInputEvent<Date>) { 
    let date = new Date(event.target.value);
    date.setDate(date.getDate() + 1);
    this.endDate=formatDate(new Date(date), 'yyyy-MM-dd', 'en');
    this.listOfCreditAndTransaction()
  }
  selectCompany(companyName){
    if(companyName!="none"){
      this.companyName=companyName;
      this.listOfCreditAndTransaction()
    }
    
  }
}
