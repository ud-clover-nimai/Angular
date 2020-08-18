import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { ActivatedRoute, Router, NavigationExtras,NavigationEnd  } from '@angular/router';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { load_dashboard } from '../../../assets/js/commons'
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
// import { filter } from 'rxjs/operators';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
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
  public accountPages:string="";
  public transactionpages:string="";
  public isCollapsed:string="collapsed";
  public areaExpandedacc:boolean=false;
  public areaExpandedtra:boolean=false;
  draftData: any;
  draftcount:any;
  nimaiCount: any = "";
  constructor(public service: UploadLcService,public fb: FormBuilder, public titleService: TitleService, public psd: PersonalDetailsService, public activatedRoute:ActivatedRoute, public router:Router, public getCount: SubscriptionDetailsService) {
    let userId = sessionStorage.getItem('userID');
    this.getPersonalDetails(userId);
    if (userId.startsWith('RE')) {
      this.isReferrer = true;
    } else if (userId.startsWith('BC') || userId.startsWith('CU')) {
      this.isReferrer = false;
      this.isCustomer = true;
      this.isBank = false;
    } else {
      this.isReferrer = false;
      this.isCustomer = false;
      this.isBank = true;
    }

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
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

  ngOnInit() {
    load_dashboard();
    if (this.router.url===`/${this.parentURL}/dsb/personal-details` || this.router.url===`/${this.parentURL}/dsb/business-details` || this.router.url===`/${this.parentURL}/dsb/subscription` || this.router.url===`/${this.parentURL}/dsb/kyc-details`)
    {      
      this.accountPages="in"
      this.isCollapsed=""
      this.areaExpandedacc=!this.areaExpandedacc
    }else if (this.router.url===`/${this.parentURL}/dsb/new-transaction` || this.router.url===`/${this.parentURL}/dsb/active-transaction` || this.router.url===`/${this.parentURL}/dsb/transaction-details` || this.router.url===`/${this.parentURL}/dsb/draft-transaction`){
      this.transactionpages="in"
      this.isCollapsed=""
      this.areaExpandedtra=!this.areaExpandedtra
    }else if(this.router.url===`/${this.parentURL}/rcs/kyc-details` || this.router.url===`/${this.parentURL}/rcs/personal-details` ){
      this.accountPages="in"
      this.isCollapsed=""
      this.areaExpandedtra=!this.areaExpandedtra
    }

    this.searchForm = this.fb.group({
      searchText: ['']
    });

    this.titleService.titleMessage.subscribe(title => this.title = title);
    this.titleService.userMessage.subscribe(username => this.username = username);
    //this.titleService.loader.subscribe(flag => this.loading = flag);
    //this.titleService.quote.subscribe(flag=>this.isQuote=flag);
    this.callAllDraftTransaction();
    this.getNimaiCount();
  }
  callAllDraftTransaction(){
    var userIdDetail = sessionStorage.getItem('userID');
    var emailId = "";
    if(userIdDetail.startsWith('BC')){
      emailId = sessionStorage.getItem('branchUserEmailId');
    }
    const param = {
      userId: sessionStorage.getItem('userID'),
      "branchUserEmail":emailId
    }
    
    this.service.getCustDraftTransaction(param).subscribe(
      (response) => {
        this.draftData = JSON.parse(JSON.stringify(response)).data;  
        if(this.draftData)      
        if(this.draftData.length>0){
          this.draftcount=this.draftData.length;
        }
      },(error) =>{
        
      }
      )
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

          this.username = personalDetails.firstName + " " + personalDetails.lastName;
          this.titleService.changeUserName(this.username);
          this.titleService.loading.next(false);
        },
        (error) => {
          this.titleService.loading.next(false);
        }
      )
  }  

  getNimaiCount(){
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": ""
    }
    
    this.getCount.getTotalCount(data).subscribe(
      response => {
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
      },
      error => {}
    )
  }

}
