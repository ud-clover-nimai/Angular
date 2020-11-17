import { Component, OnInit } from '@angular/core';
import { creditTransaction } from  'src/assets/js/commons';
import { DashboardDetailsService } from 'src/app/services/dashboard-details/dashboard-details.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-credit-and-transactions',
  templateUrl: './credit-and-transactions.component.html',
  styleUrls: ['./credit-and-transactions.component.css']
})
export class CreditAndTransactionsComponent implements OnInit {
  creditData:any;
  noData:any;
  public startDate:any;
  public endDate:any;
  constructor(public service: DashboardDetailsService) { }
  ngOnInit() {
    creditTransaction();
    this.listOfCreditAndTransaction();
    this.startDate=""
    this.endDate=""
  }
  listOfCreditAndTransaction(){   
    const param = {
      userid:sessionStorage.getItem('userID'),
      txnInsertedDate:this.startDate,
      txnDate:this.endDate
    }
    this.service.getCreditAndTransactionList(param).subscribe(
      (response) => {
        if(JSON.parse(JSON.stringify(response)).data)
          this.creditData = JSON.parse(JSON.stringify(response)).data;
        else
          this.creditData=""  
        if(this.creditData.length === 0){
          this.noData = true;
        }else{
          this.noData=false;
        }
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
}
