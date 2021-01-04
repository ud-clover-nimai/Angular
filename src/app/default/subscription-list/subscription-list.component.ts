import { Component, OnInit } from '@angular/core';
import { creditTransaction } from  'src/assets/js/commons';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit {
  subscriptionData:any;
  noData:any;
  constructor(public service: SubscriptionDetailsService) { }

  ngOnInit() {
    this.subscriptionList();
  }
  subscriptionList(){
    console.log("function called..")
    this.service.getSubscriptionList().subscribe(
      (response) => {
        creditTransaction();
        if(JSON.parse(JSON.stringify(response)).data){
          this.subscriptionData = JSON.parse(JSON.stringify(response)).data.customerSplans;
          console.log("this.subscriptionData---",this.subscriptionData)
        }
        else{
          this.subscriptionData=""
        }  
        if(this.subscriptionData.length === 0){
          this.noData = true;
        }else{
          this.noData=false;
        }
      },(error) =>{
        this.noData = true;
      }
      )
  }
}
