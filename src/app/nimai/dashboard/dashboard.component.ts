import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { ActivatedRoute, Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { load_dashboard } from '../../../assets/js/commons'
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { LoginService } from 'src/app/services/login/login.service';
import * as $ from '../../../assets/js/jquery.min';

// import { filter } from 'rxjs/operators';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public searchForm: FormGroup;
  public title: string = "Dashboard";
  public username: string = "";
  public isReferrer: boolean = false;
  public isCustomer: boolean = false;
  public isBank: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  public accountPages: string = "";
  public transactionpages: string = "";
  public isCollapsed: string = "collapsed";
  public areaExpandedacc: boolean = false;
  public areaExpandedtra: boolean = false;
  public isDisablePlan:boolean=false;
  public isDisableKyc:boolean=false;
  public hidePlanFromProfile:boolean=false;
  public hidePlanFromMenu:boolean=false;
  public hideManageUser:boolean=false;
  public hideMyProfile:boolean=true;
  
  public hideCreditTransaction:boolean=false;
  draftData: any;
  draftcount: any;
  draftcountBank: any;
  nimaiCount: any = "";
  isQuote = false;
  loading = false;
  userType: any;
  creditCount: any;
  userStat: any;
  creditenable: string;
  enableuserStat: boolean=false;
  referenceTab:boolean=false;
  hideSubAccount: boolean=false;
  accountType: string;
  public hideVas: boolean=true;
  emailid: string="";
  hideRefer: boolean=false;
  hideChangepass: boolean=false;
  constructor(public service: UploadLcService, public fb: FormBuilder, public titleService: TitleService, public psd: PersonalDetailsService,public nts:NewTransactionService,
     public activatedRoute: ActivatedRoute, public router: Router, public getCount: SubscriptionDetailsService,public loginService: LoginService) {
     
      this.activatedRoute.parent.url.subscribe((urlPath) => {
        this.parentURL = urlPath[urlPath.length - 1].path;
      });
      this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
        this.subURL = urlPath[urlPath.length - 1].path;
      });

      let userId = sessionStorage.getItem('userID');
    this.getPersonalDetails(userId);
    if (userId.startsWith('RE')) {
      this.isReferrer = true;
    } else if (userId.startsWith('CU')) {
      this.isReferrer = false;
      this.isCustomer = true;
      this.isBank = false;
      
    }   else if (userId.startsWith('BC')) {
      this.isReferrer = false;
      this.isCustomer = true;
      this.isBank = false;
     
    
    }else {
      this.isReferrer = false;
      this.isCustomer = false;
      this.isBank = true;
    }

    if (userId.startsWith('RE')) {
      this.userType = "Referrer";
      this.hideSubAccount=true;

      this.usersStat('RE');
    } else if (userId.startsWith('BC')) {
      this.userType = "Bank as a Customer";
      this.hideManageUser=true;
      this.hideRefer=false;
      this.hideCreditTransaction=true;
      this.usersStat('BC');
    } else if (userId.startsWith('CU')) {
      this.userType = "Customer";
      this.usersStat('CU');
    }  else if (userId.startsWith('BA')) {
      this.userType = "Bank as an Underwriter";

      this.usersStat('BA');
    }  else {
      this.userType = "";
    }



    this.callAllDraftTransaction();
    console.log("Email id --",sessionStorage.getItem('branchUserEmailId'))
    if(sessionStorage.getItem('branchUserEmailId')==null || sessionStorage.getItem('branchUserEmailId')==undefined || sessionStorage.getItem('branchUserEmailId')=="undefined"){
    //  console.log("if")
      this.emailid=""
    }else{
      this.emailid=sessionStorage.getItem('branchUserEmailId')
    }
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress":this.emailid
    }

    this.getCount.getTotalCount(data).subscribe(
      response => {        
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
        this.creditCount=this.nimaiCount.lc_count-this.nimaiCount.lcutilizedcount;
        sessionStorage.setItem("creditCount", this.creditCount);
        sessionStorage.setItem("subscriptionamount", this.nimaiCount.subscriptionamount);
        sessionStorage.setItem("paymentTransId", this.nimaiCount.paymentTransId);
        sessionStorage.setItem("subscriptionid", this.nimaiCount.subscriptionid);
        sessionStorage.setItem("isvasapplied", this.nimaiCount.isvasapplied);
        sessionStorage.setItem("subsidiries", this.nimaiCount.subsidiries);
        sessionStorage.setItem("subuticount", this.nimaiCount.subuticount);  
        sessionStorage.setItem("kycStatus", this.nimaiCount.kycstatus);
        sessionStorage.setItem('companyName', this.nimaiCount.companyname);
        sessionStorage.setItem('registeredCountry', this.nimaiCount.registeredcountry); 
        sessionStorage.setItem('isvasapplied', this.nimaiCount.isvasapplied);   
        sessionStorage.setItem('accountType', this.nimaiCount.accounttype);   
        sessionStorage.setItem('status',this.nimaiCount.status)
        if(this.nimaiCount.kycstatus=='Approved' && this.nimaiCount.subscribertype !== 'REFERRER'){
          this.creditenable='yes';
        }else{
          this.creditenable='no';
        }
       
        if(this.nimaiCount.isbdetailfilled){
          this.isDisablePlan=true;
        }else{
          this.isDisablePlan=false;
        }
        if(this.nimaiCount.accounttype == 'SUBSIDIARY' || this.nimaiCount.accounttype == 'BANKUSER' || this.nimaiCount.subscribertype == 'REFERRER'){
          this.hidePlanFromProfile=true;
          this.hidePlanFromMenu=true;
         
        }
        if(this.nimaiCount.kycstatus!=='Approved'){
          this.hideManageUser=true;
          this.hideCreditTransaction=true;
          this.hideRefer=true;
        }
        console.log("this.hidePlanFromProfile--",this.hidePlanFromProfile)
        if(this.nimaiCount.subscribertype == 'REFERRER')
          this.referenceTab=true;
        if(this.nimaiCount.issplanpurchased=="1"){
          this.isDisableKyc=true;
        }else if(this.nimaiCount.accounttype == 'SUBSIDIARY' && this.nimaiCount.isbdetailfilled){
          this.isDisableKyc=true;
         }else if(this.nimaiCount.subscribertype == 'REFERRER' && this.nimaiCount.kycstatus=="Rejected"){
          this.isDisableKyc=true;
         }else{
          this.isDisableKyc=false;
         }
         console.log(this.nimaiCount.kycstatus)
         if(this.nimaiCount.kycstatus=="Pending"){
          this.isDisableKyc=false;
         }
         this.accountType=sessionStorage.getItem('accountType');
         if(this.accountType == 'SUBSIDIARY'){
           this.hideSubAccount=true;
           this.hideChangepass=false;
           this.hideCreditTransaction=false;
           this.hideVas=false;
           this.hideMyProfile=true;
         }else if(this.accountType == 'Passcode'){
           this.hideSubAccount=true;
           this.hideChangepass=true;
           this.hideCreditTransaction=false;
           this.hideVas=false;
           this.hideManageUser=true;
           this.hideRefer=true;
           this.hideMyProfile=false;
       
         }else if(this.accountType == 'MASTER'){
           this.hideMyProfile=true;
           this.hideCreditTransaction=false;
       
         }else if(this.accountType=='BANKUSER'){
           this.hideManageUser=true;
           this.hideSubAccount=true;
           this.hideChangepass=false;
         }
      // if( this.nimaiCount.status=='INACTIVE'){
       // $('#trnxInactive').show();

        // const navigationExtras: NavigationExtras = {
        //         state: {
        //           title: 'Transaction Not Allowed !',
        //           message: 'Your Subscription Plan has been INACTIVATE ! Please Renew Your Subscription Plan',
        //           parent: this.parentURL + '/dsb/subscription',
        //           redirectedFrom: "New-Transaction"
        //         }
        //       };
        //       this.router.navigate([`/${this.parentURL}/dsb/subscription/error`], navigationExtras)
        //         .then(success => console.log('navigation success?', success))
        //         .catch(console.error);
            
           // }
      },
      error => { }
    )




    this.nts.creditCount.subscribe(ccredit=>{
      this.creditCount=ccredit;
          });

    // this.activatedRoute.parent.url.subscribe((urlPath) => {
    //   this.parentURL = urlPath[urlPath.length - 1].path;
    // });
    // this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
    //   this.subURL = urlPath[urlPath.length - 1].path;
    // });
    // router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)  
    // ).subscribe((event: NavigationEnd) => {
    //   if (event.url===`/${this.parentURL}/dsb/personal-details` || event.url===`/${this.parentURL}/dsb/business-details` || event.url===`/${this.parentURL}/dsb/subscription` || event.url===`/${this.parentURL}/dsb/kyc-details`)
    //   {      
    //     this.accountPages="in"
    //     this.isCollapsed=""
    //     this.areaExpandedacc=!this.areaExpandedacc
    //   }else if (event.url===`/${this.parentURL}/dsb/new-transaction` || event.url===`/${this.parentURL}/dsb/active-transaction` || event.url===`/${this.parentURL}/dsb/transaction-details` || event.url===`/${this.parentURL}/dsb/draft-transaction`){
    //     this.transactionpages="in"
    //     this.isCollapsed=""
    //     this.areaExpandedtra=!this.areaExpandedtra
    //   }else if(event.url===`/${this.parentURL}/rcs/kyc-details` || event.url===`/${this.parentURL}/rcs/personal-details` ){
    //     this.accountPages="in"
    //     this.isCollapsed=""
    //     this.areaExpandedtra=!this.areaExpandedtra
    //   }
    // });
  }
  // inactiveOk(){
  //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //         this.router.navigate([`/${this.parentURL}/dsb/subscription`]);
  //     });
  // }
  ngOnInit() {
   // this.getNimaiCount();

    load_dashboard();
    if (this.router.url === `/${this.parentURL}/dsb/personal-details` || this.router.url === `/${this.parentURL}/dsb/online-payment` || this.router.url === `/${this.parentURL}/dsb/business-details` || this.router.url === `/${this.parentURL}/dsb/subscription` || this.router.url === `/${this.parentURL}/dsb/kyc-details`) {      
      this.accountPages = "in"
      this.isCollapsed = ""
      this.areaExpandedacc = !this.areaExpandedacc
    }else if(this.router.url === `/${this.parentURL}/dsb/personal-details/success` || this.router.url === `/${this.parentURL}/dsb/business-details/success`|| this.router.url === `/${this.parentURL}/dsb/online-payment/success`){
      this.accountPages = "in"
      this.isCollapsed = ""
      this.areaExpandedacc = !this.areaExpandedacc
    } else if (this.router.url === `/${this.parentURL}/dsb/new-transaction` || this.router.url === `/${this.parentURL}/dsb/active-transaction` || this.router.url === `/${this.parentURL}/dsb/transaction-details` || this.router.url === `/${this.parentURL}/dsb/draft-transaction`) {
      this.transactionpages = "in"
      this.isCollapsed = ""
      this.areaExpandedtra = !this.areaExpandedtra
    } else if (this.router.url === `/${this.parentURL}/rcs/kyc-details` || this.router.url === `/${this.parentURL}/rcs/personal-details`) {
      this.accountPages = "in"
      this.isCollapsed = ""
      this.areaExpandedtra = !this.areaExpandedtra
    }

    this.searchForm = this.fb.group({
      searchText: ['']
    });

    this.titleService.titleMessage.subscribe(title => this.title = title);
    this.titleService.userMessage.subscribe(username => this.username = username);
    //this.titleService.loader.subscribe(flag => this.loading = flag);
    //this.titleService.quote.subscribe(flag=>this.isQuote=flag);
   // this.callAllDraftTransaction();
  //   this.accountType=sessionStorage.getItem('accountType');
  // if(this.accountType == 'SUBSIDIARY'){
  //   this.hideSubAccount=true;
  //   this.hideChangepass=false;
  //   this.hideCreditTransaction=false;
  //   this.hideVas=false;
  //   this.hideMyProfile=true;
  // }else if(this.accountType == 'Passcode'){
  //   this.hideSubAccount=true;
  //   this.hideChangepass=true;
  //   this.hideCreditTransaction=false;
  //   this.hideVas=false;
  //   this.hideManageUser=true;
  //   this.hideRefer=true;
  //   this.hideMyProfile=false;

  // }else if(this.accountType == 'MASTER'){
  //   this.hideMyProfile=true;
  //   this.hideCreditTransaction=false;

  // }else if(this.accountType=='BANKUSER'){
  //   this.hideManageUser=true;
  //   this.hideSubAccount=true;
  //   this.hideChangepass=false;
  // }
  }
  callAllDraftTransaction() {
    if (this.isCustomer) {
      var userIdDetail = sessionStorage.getItem('userID');
      var emailId = "";
      if (userIdDetail.startsWith('BC')) {
        emailId = sessionStorage.getItem('branchUserEmailId');
      }
      const param = {
        userId: sessionStorage.getItem('userID'),
        "branchUserEmail": emailId
      }

      this.service.getCustDraftTransaction(param).subscribe(
        (response) => {
          this.draftData = JSON.parse(JSON.stringify(response)).data;
          if (this.draftData) {
            if (this.draftData.length > 0) {
              this.draftcount = this.draftData.length;
            }
          }
        }, (error) => {

        }
      )
    }
    if (this.isBank) {
      const data = {
        "bankUserId": sessionStorage.getItem('userID')
      }
      this.service.getBankDraftQuotation(data).subscribe(
        (response) => {
          this.draftData = JSON.parse(JSON.stringify(response)).data;
          if(this.draftData)
          if (this.draftData.length > 0) {
            this.draftcountBank = this.draftData.length;
          }
        }, (error) => {

        }
      )
    }

  }
  search(): void {

  }

  public getPersonalDetails(userID: string) {
    this.titleService.loading.next(true);
    this.psd.getPersonalDetails(userID)
      .subscribe(
        (response) => {
          let responseData = JSON.parse(JSON.stringify(response));
          let personalDetails = responseData.data;
          sessionStorage.setItem('custUserEmailId', personalDetails.emailAddress);
          this.username = personalDetails.firstName + " " + personalDetails.lastName;
          this.titleService.changeUserName(this.username);
          this.titleService.loading.next(false);
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
  }

  usersStat(users) {
    this.getCount.getUserStats()
    .subscribe(
      (response) => {
        this.userStat = JSON.parse(JSON.stringify(response)).data;
        var str = this.userStat; 
        var splittedStr = str.split(", ", 2); 
        if(users=='BA'){
         var colonSplit = splittedStr[1]
          var arrsplit = colonSplit.split(": ", 2); 
          this.userStat=arrsplit[1]+" banks placed quote on NimaiTrade in last 24 hours";
        }else if(users=='CU' || users=='BC'){
        var colonSplit = splittedStr[0]
        var arrsplit = colonSplit.split(": ", 2); 
        this.userStat=arrsplit[1]+" customers placed transaction on NimaiTrade in last 24 hours";
        }else if(users=='RE'){
           this.enableuserStat=true;
        }

       

      })
  }
  getNimaiCount() {
    this.callAllDraftTransaction();
    //console.log("Email id --",sessionStorage.getItem('branchUserEmailId'))
    if(sessionStorage.getItem('branchUserEmailId')==null || sessionStorage.getItem('branchUserEmailId')==undefined || sessionStorage.getItem('branchUserEmailId')=="undefined"){
    //  console.log("if")
      this.emailid=""
    }else{
      this.emailid=sessionStorage.getItem('branchUserEmailId')
    }
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress":this.emailid
    }

    this.getCount.getTotalCount(data).subscribe(
      response => {        
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
        this.creditCount=this.nimaiCount.lc_count-this.nimaiCount.lcutilizedcount;
        sessionStorage.setItem("creditCount", this.creditCount);
        sessionStorage.setItem("subscriptionamount", this.nimaiCount.subscriptionamount);
        sessionStorage.setItem("paymentTransId", this.nimaiCount.paymentTransId);
        sessionStorage.setItem("subscriptionid", this.nimaiCount.subscriptionid);
        sessionStorage.setItem("isvasapplied", this.nimaiCount.isvasapplied);
        sessionStorage.setItem("subsidiries", this.nimaiCount.subsidiries);
        sessionStorage.setItem("subuticount", this.nimaiCount.subuticount);  
        sessionStorage.setItem("kycStatus", this.nimaiCount.kycstatus);
        sessionStorage.setItem('companyName', this.nimaiCount.companyname);
        sessionStorage.setItem('registeredCountry', this.nimaiCount.registeredcountry); 
        sessionStorage.setItem('isvasapplied', this.nimaiCount.isvasapplied);   
        sessionStorage.setItem('accountType', this.nimaiCount.accounttype);   
        if(this.nimaiCount.kycstatus=='Approved' && this.nimaiCount.subscribertype !== 'REFERRER'){
          this.creditenable='yes';
        }else{
          this.creditenable='no';
        }
       
        if(this.nimaiCount.isbdetailfilled){
          this.isDisablePlan=true;
        }else{
          this.isDisablePlan=false;
        }
        if(this.nimaiCount.accounttype == 'SUBSIDIARY' || this.nimaiCount.accounttype == 'BANKUSER' || this.nimaiCount.subscribertype == 'REFERRER'){
          this.hidePlanFromProfile=true;
          this.hidePlanFromMenu=true;
         
        }
        if(this.nimaiCount.kycstatus!=='Approved'){
          this.hideManageUser=true;
          this.hideCreditTransaction=true;
          this.hideRefer=true;
        }
        if(this.nimaiCount.subscribertype == 'REFERRER')
          this.referenceTab=true;
        if(this.nimaiCount.issplanpurchased=="1"){
          this.isDisableKyc=true;
        }else if(this.nimaiCount.accounttype == 'SUBSIDIARY' && this.nimaiCount.isbdetailfilled){
          this.isDisableKyc=true;
         }else if(this.nimaiCount.subscribertype == 'REFERRER' && this.nimaiCount.kycstatus=="Rejected"){
          this.isDisableKyc=true;
         }else{
          this.isDisableKyc=false;
         }
         console.log(this.nimaiCount.kycstatus)
         if(this.nimaiCount.kycstatus=="Pending"){
          this.isDisableKyc=false;
         }
         this.accountType=sessionStorage.getItem('accountType');
         if(this.accountType == 'SUBSIDIARY'){
           this.hideSubAccount=true;
           this.hideChangepass=false;
           this.hideCreditTransaction=false;
           this.hideVas=false;
           this.hideMyProfile=true;
         }else if(this.accountType == 'Passcode'){
           this.hideSubAccount=true;
           this.hideChangepass=true;
           this.hideCreditTransaction=false;
           this.hideVas=false;
           this.hideManageUser=true;
           this.hideRefer=true;
           this.hideMyProfile=false;
       
         }else if(this.accountType == 'MASTER'){
           this.hideMyProfile=true;
           this.hideCreditTransaction=false;
       
         }else if(this.accountType=='BANKUSER'){
           this.hideManageUser=true;
           this.hideSubAccount=true;
           this.hideChangepass=false;
         }
      //  if( this.nimaiCount.status=='INACTIVE'){
      //   $('#trnxInactive').show();

        // const navigationExtras: NavigationExtras = {
        //         state: {
        //           title: 'Transaction Not Allowed !',
        //           message: 'Your Subscription Plan has been INACTIVATE ! Please Renew Your Subscription Plan',
        //           parent: this.parentURL + '/dsb/subscription',
        //           redirectedFrom: "New-Transaction"
        //         }
        //       };
        //       this.router.navigate([`/${this.parentURL}/dsb/subscription/error`], navigationExtras)
        //         .then(success => console.log('navigation success?', success))
        //         .catch(console.error);
            
        //    }
      },
      error => { }
    )
  }
  public logout():void{
    const data = {
      "userId": sessionStorage.getItem('userID')
    }
    this.loginService.logOut(data).subscribe(
      (response) => {
      },(error) =>{
       console.log("error")
      }
      )
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
