import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.css']
})
export class AccountStatusComponent implements OnInit {
  public subURL: string = "";
  public parentURL: string = "";
  nimaiCount: any;
  kycStatus: any="";
  constructor(public activatedRoute: ActivatedRoute,public getCount: SubscriptionDetailsService,public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
   }

  ngOnInit() {
   
      let data = {
        "userid": sessionStorage.getItem('userID'),
        "emailAddress": ""
      }
  
      this.getCount.getTotalCount(data).subscribe(
        response => {
          this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
          this.kycStatus=this.nimaiCount.kycstatus
    
    // let kycStatus = sessionStorage.getItem("kycStatus");
    console.log("kycStatus---",this.kycStatus)
    if(this.kycStatus=="Approved")
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/${this.subURL}/${this.parentURL}/dashboard-details`])
        .then(success => console.log('navigation success?', success))
        .catch(console.error);
       }); 
    else if(this.kycStatus=="Rejected")
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
     }); 
     // window.location.reload();

    else  
      this.router.navigate([`/${this.subURL}/${this.parentURL}/account-review`])
 
    },  
    error => { }
  )
 
    }

}
