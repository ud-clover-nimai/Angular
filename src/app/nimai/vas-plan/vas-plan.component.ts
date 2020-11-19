import { Component, OnInit } from '@angular/core';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { Router, ActivatedRoute,NavigationExtras} from '@angular/router';
@Component({
  selector: 'app-vas-plan',
  templateUrl: './vas-plan.component.html',
  styleUrls: ['./vas-plan.component.css']
})
export class VasPlanComponent implements OnInit {
  public parentURL: string = "";
  public subURL: string = "";
  advDetails: any = "";
  viewAdvDetails:any="";
  callVasService=false;
  choosedPrice: any;
  advPrice:any;
  addedAmount: any;
  showVasPlan =true;
  showSuccess=false;
  isvasapplied:any;
  subscriptionId:any;
  constructor(public router: Router, public activatedRoute: ActivatedRoute,public subscriptionService: SubscriptionDetailsService) { }
  ngOnInit() {
    this.addedAmount = sessionStorage.getItem('subscriptionamount');
    this.choosedPrice=sessionStorage.getItem('subscriptionamount');
    this.subscriptionId=sessionStorage.getItem('subscriptionid');
    this.isvasapplied=sessionStorage.getItem('isvasapplied');
    if(this.isvasapplied==="true"){
      this.getVASByUserId();   
      this.showSuccess=true;
      this.showVasPlan =false;
    }else{
      this.viewVASPlans();   
      this.showSuccess=false;
      this.showVasPlan =true;
    }
  }
  getVASByUserId(){
    let data = {
      "userId": sessionStorage.getItem("userID")
    }
    this.subscriptionService.getVASByUserId(data).subscribe(response => {
      let res = JSON.parse(JSON.stringify(response.data[0]));
      this.viewAdvDetails=res;
    })
  }
  viewVASPlans(){
    var userid = sessionStorage.getItem("userID");
    let data = {
      "country_name": sessionStorage.getItem("registeredCountry")
    }
    this.subscriptionService.viewAdvisory(data).subscribe(response => {
      this.advDetails = JSON.parse(JSON.stringify(response)).data[0];
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
    if(this.callVasService)   {
      let req = {
        "userId": sessionStorage.getItem('userID'),
        "vasId": data.vas_id,
        "subscriptionId":this.subscriptionId
      }
      this.subscriptionService.addVas(req).subscribe(data => {
        let sdata= JSON.parse(JSON.stringify(data))
        if(sdata.status=="Success"){
          this.showVasPlan =false;
          this.showSuccess=true;
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/vasPlan`]);
        });
        }else{
          console.log("error")
        }
      }
      )
    }else{
      alert("Please add Vas Plan.")
    }
  }
}
