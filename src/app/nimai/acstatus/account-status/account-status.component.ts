import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.css']
})
export class AccountStatusComponent implements OnInit {
  public subURL: string = "";
  public parentURL: string = "";
  constructor(public activatedRoute: ActivatedRoute,public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
   }

  ngOnInit() {
    let kycStatus = sessionStorage.getItem("kycStatus");
    console.log("kycStatus---",kycStatus)
    if(kycStatus=="Approved")
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/${this.subURL}/${this.parentURL}/dashboard-details`])
        .then(success => console.log('navigation success?', success))
        .catch(console.error);
       }); 
    else if(kycStatus=="Rejected")
    //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //   this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details`])
    //   .then(success => console.log('navigation success?', success))
    //   .catch(console.error);
    //  }); 
      window.location.reload();
    else  
      this.router.navigate([`/${this.subURL}/${this.parentURL}/account-review`])
  }

}
