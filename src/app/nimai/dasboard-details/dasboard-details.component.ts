import { Component, OnInit } from '@angular/core';
import { dashboard_details } from 'src/assets/js/commons';
import { DashboardDetailsService } from 'src/app/services/dashboard-details/dashboard-details.service';
@Component({
  selector: 'app-dasboard-details',
  templateUrl: './dasboard-details.component.html',
  styleUrls: ['./dasboard-details.component.css']
})
export class DasboardDetailsComponent implements OnInit {
  isCustomer: boolean = false;
  isBank: boolean = false;
  dashboardData:any;
  custmrdasbrdcount:any;
  transactionbifurcation:any;
  latestacceptedtrxn:any;
  userId:any;
  title = 'Browser market shares at a specific website, 2014';
   type = 'PieChart';
   data = [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7] 
   ];
   columnNames = ['Browser', 'Percentage'];
   options = {    
   };
   width = 550;
   height = 400;
  constructor(public service: DashboardDetailsService) { }

  ngOnInit() {
    dashboard_details();
    this.userId=sessionStorage.getItem('userID')
    if(this.userId.startsWith('CU')){
      this.isCustomer=true;
      this.getDashboardDetails();
    }
   
  }
  getDashboardDetails(){
    const param = {
      userId: this.userId,
      year: "",
      startDate:"",
      endDate:""
    }

    this.service.getDashboardDetails(param).subscribe(
      (response) => {
        this.dashboardData = JSON.parse(JSON.stringify(response)).data;
        this.custmrdasbrdcount=this.dashboardData.custmrdasbrdcount
        this.transactionbifurcation=this.dashboardData.transactionbifurcation
        this.latestacceptedtrxn=this.dashboardData.latestacceptedtrxn
      }, (error) => {

      }
    )
  }
}
