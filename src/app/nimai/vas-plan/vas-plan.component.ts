import { Component, OnInit } from '@angular/core';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
@Component({
  selector: 'app-vas-plan',
  templateUrl: './vas-plan.component.html',
  styleUrls: ['./vas-plan.component.css']
})
export class VasPlanComponent implements OnInit {
  advDetails: any = "";
  callVasService=false;
  choosedPrice: any;
  advPrice:any;
  addedAmount: any;
  showVasPlan =true;
  showSuccess=false;
  isvasapplied:any;
  constructor(public subscriptionService: SubscriptionDetailsService) { }
  ngOnInit() {
    this.viewVASPlans();    
    this.addedAmount = sessionStorage.getItem('subscriptionamount');
    this.choosedPrice=sessionStorage.getItem('subscriptionamount');
    this.isvasapplied=sessionStorage.getItem('isvasapplied');
    if(this.isvasapplied){
      this.showSuccess=true;
      this.showVasPlan =false;
    }else{
      this.showSuccess=false;
      this.showVasPlan =true;
    }
  }
  viewVASPlans(){
    var userid = sessionStorage.getItem("userID");
  
    let data = {
      "country_name": sessionStorage.getItem("registeredCountry")
    }
    this.subscriptionService.viewAdvisory(data).subscribe(response => {
      this.advDetails = JSON.parse(JSON.stringify(response)).data[0];
      console.log("data--",JSON.parse(JSON.stringify(response)).data[0])
      this.advPrice = this.advDetails.pricing;
    })
  }
  addAdvService(event){
    if (event.target.value === "Add") {
      this.callVasService=true;
      this.addedAmount = parseFloat(this.choosedPrice) + parseFloat(this.advPrice);
      event.target.value = "Remove";
      } else {
      this.callVasService=false;  
      event.target.value = "Add";
      this.addedAmount = this.choosedPrice;
      }      
  }
  addVasPlan(data){
    console.log("data-",data)    
      let req = {
        "userId": sessionStorage.getItem('userID'),
        "vasId": data.vas_id,
        "subscriptionId":data.subscriptionId
      }
      this.subscriptionService.addVas(req).subscribe(data => {
        console.log("data---",data)
        let sdata= JSON.parse(JSON.stringify(data))
        if(sdata.status=="Success"){
          this.showVasPlan =false;
          this.showSuccess=true;
        }else{
          console.log("error")
        }
      }
      )
    } 
}
