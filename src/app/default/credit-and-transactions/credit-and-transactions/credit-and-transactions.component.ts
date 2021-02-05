import { Component, OnInit } from '@angular/core';
import { creditTransaction,        custTrnsactionDetail} from  'src/assets/js/commons';
import { DashboardDetailsService } from 'src/app/services/dashboard-details/dashboard-details.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
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
  companyName: any="";
  subsidiaries: any;
  userId: string;
  userBA: boolean=false;
  userBC: boolean=false;
  userCU: boolean=false;
  accountType: string="";
  disablesubsi: boolean;
  disableUserCode: boolean;
  selectedUCode: any="";
  usercode: any="";
  usersid: string="";
  totalTrnx: any="";
  selecteduserCode: string="";
  constructor(public titleService: TitleService,public service: DashboardDetailsService,public psd: PersonalDetailsService) {

   }
  ngOnInit() {
    this.accountType=sessionStorage.getItem('accountType')
    this.userId=sessionStorage.getItem('userID');
    this.listOfCreditAndTransaction(undefined,this.userId);
   this.getSubsidiaryData();
 
    this.startDate=""
    this.endDate=""

      if(this.userId.startsWith('BA')){
      this.userBA=true;
      
    }else if(this.userId.startsWith('BC')){
      this.userBC=true;
  }else if(this.userId.startsWith('CU')){
      this.userCU=true;
  }
  if(this.accountType=='MASTER' && this.userId.startsWith('CU')){
    this.disablesubsi=true
    this.disableUserCode=true
  }     
  else  if (this.accountType=='MASTER' && this.userId.startsWith('BC')){
    this.disablesubsi=false
    this.disableUserCode=true
  }
  else if(this.accountType=='SUBSIDIARY' && this.userId.startsWith('CU')){
    this.disablesubsi=false
    this.disableUserCode=true
  } 
  else if(this.accountType=='MASTER' && this.userId.startsWith('BA')){
    this.disablesubsi=true
    //this.disableUserCode=true
  } 
  
   else if(this.accountType=='BANKUSER' && this.userId.startsWith('BA')){
    this.disablesubsi=false
    this.disableUserCode=false
    this.userBA=false;
  } 
   else{
    this.disablesubsi=false
    this.disableUserCode=false
  }
  }
   arrUnique(a){
    var t = [];
    for(var x = 0; x < a.length; x++){
      if(t.indexOf(a[x]) == -1)t.push(a[x]);
    }
    return t;
   }
  listOfCreditAndTransaction(comanyname:any,userid:any){   
    this.titleService.quote.next(true);

    this.usersid=userid
    var emailId = "";
    emailId = sessionStorage.getItem('branchUserEmailId');
    if(this.selectedUCode){
      emailId=this.selectedUCode;
    }else{
      emailId=""
      this.getUsercodeData(userid)
    this.selectedUCode="";
    }
  
if(comanyname==undefined){
  this.companyName=""
}else{
  this.companyName=comanyname
}
if(this.userId.startsWith('BA')){
  const param = {
    "userid":userid,
   
  }
  this.service.getCreditTxnForCustomerByBankUserId(param).subscribe(
    (response) => {
     // creditTransaction();
      custTrnsactionDetail();

      this.creditData=[];
        this.creditData = JSON.parse(JSON.stringify(response)).data;
     
      if(JSON.parse(JSON.stringify(response)).data){
        
        let total = 0;
        let savings=0;
        for (let i = 0; i < this.creditData.length; i++) {
         
          total +=Number(this.creditData[i].creditUsed);
          savings+=Number(this.creditData[i].savings);
        }
        this.creditUsed=total;
        this.totalSavings=savings;
        this.totalTrnx= this.creditData.length;
      }
   
     
    },(error) =>{
      this.noData = true;
    }
    )
}else{
  //this.accountType=sessionStorage.getItem('accountType')
  // if(this.accountType=='Passcode'){
  //   this.usersid=""
  //    }else{
  //      this.usersid=userid
  //    } 

 const param = {
  "userid":userid,
  "txnInsertedDate":this.startDate,
  "txnDate":this.endDate,
  "companyName":this.companyName,
  "passcodeUser":emailId
}
this.usersid=userid
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
          this.totalTrnx= this.creditData.length;
        }
        
       
      },(error) =>{
        this.noData = true;
      }
      )
     
     
    }
    
  }
  changeStartDate(event: MatDatepickerInputEvent<Date>) {    
    let formatedDate  = formatDate(new Date(event.target.value), 'yyyy-MM-dd', 'en'); 
    this.startDate=formatedDate
    this.listOfCreditAndTransaction(undefined,sessionStorage.getItem('userId'))
  }
  changeEndDate(event: MatDatepickerInputEvent<Date>) { 
    let date = new Date(event.target.value);
    date.setDate(date.getDate() + 1);
    this.endDate=formatDate(new Date(date), 'yyyy-MM-dd', 'en');
    this.listOfCreditAndTransaction(undefined,sessionStorage.getItem('userId'))
  }
  selectCompany(companyName){
    if(companyName!="none"){
      this.companyName=companyName;
      this.listOfCreditAndTransaction(undefined,sessionStorage.getItem('userId'))
    }
    
  }
  getSubsidiaryData(){
    const data = {
      "userId": sessionStorage.getItem('userID'),
    }
    this.psd.getSubUserList(data).
      subscribe(
        (response) => {
          this.subsidiaries = JSON.parse(JSON.stringify(response)).list;
                },
        (error) => {}
      )
  }
  getUsercodeData(userid){

    const data={
      "userId": userid,
      "branchUserEmail":this.selectedUCode
    }
    this.psd.getbranchUserList(data).
      subscribe(
        (response) => {
          this.usercode = JSON.parse(JSON.stringify(response)).list;
               },
        (error) => {}
      )
 
  }
  
selectSubsidiaries(val: any) {
 // this.selectedSub=val;
 
  this.listOfCreditAndTransaction(undefined,val)
  
}
selectUsercode(val: any) {
  this.selecteduserCode =sessionStorage.getItem('userID')
  this.selectedUCode=val;
  this.listOfCreditAndTransaction(undefined,this.selecteduserCode)

}
}
