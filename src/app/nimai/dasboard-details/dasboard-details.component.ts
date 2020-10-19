import { Component, OnInit , ElementRef, ViewChild,AfterViewInit} from '@angular/core';
import { dashboard_details } from 'src/assets/js/commons';
import { DashboardDetailsService } from 'src/app/services/dashboard-details/dashboard-details.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
declare let google: any;
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
  public piechartcountry:any;
  public piechartgoods:any;
  userId:any;
  public startDate:any;
  public endDate:any;
  @ViewChild('pieChart', { static: true }) pieChart: ElementRef
  constructor(public service: DashboardDetailsService) { }
  ngOnInit() {
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
        this.piechartcountry=this.dashboardData.piechartcountry
        this.piechartgoods=this.dashboardData.piechartgoods
        var data=[];
        var Header= ['Country', 'Count'];
        data.push(Header);
        for (var i = 0; i < this.piechartcountry.length; i++) {
            var temp=[];
            temp.push(this.piechartcountry[i].countryName);
            temp.push(Number(this.piechartcountry[i].countryCount));
            data.push(temp);
        }
        var data1=[];
        var Header1= ['Goods', 'Count'];
        data1.push(Header1);
        for (var i = 0; i < this.piechartgoods.length; i++) {
            var temp=[];
            temp.push(this.piechartgoods[i].goodsType);
            temp.push(Number(this.piechartgoods[i].goodsCount));
            data1.push(temp);
        }
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => this.drawChart1(data));
        google.charts.setOnLoadCallback(() => this.drawChart2(data1));
      }, (error) => {

      }
    )
  }
   
  drawChart1(data){
      const cdata =new google.visualization.arrayToDataTable(data)
      const options = {
        legend: { 'position': 'top', 'alignment': 'center' },
        pieSliceText: 'value'
      };
      const chart = new google.visualization.PieChart(document.getElementById('pieChart'));
      chart.draw(cdata, options);   
  }
  drawChart2(data){
    const cdata = new google.visualization.arrayToDataTable(data)
    const options = {
      legend: { 
        'position': 'top', 
        'alignment': 'center'
      },
      pieSliceText: 'value' 
    };
    const chart = new google.visualization.PieChart(document.getElementById('pieChart1'));
    chart.draw(cdata, options);   
}
gettransactionBifurcation(){
  const param = {
    userId: this.userId,
    year: "",
    startDate:this.startDate,
    endDate:this.endDate
  }

  this.service.getDashboardDetails(param).subscribe(
    (response) => {
      this.dashboardData = JSON.parse(JSON.stringify(response)).data;
      if(this.dashboardData.transactionbifurcation)
        this.transactionbifurcation=this.dashboardData.transactionbifurcation
      else  
       this.transactionbifurcation=""

    }, (error) => {

    }
  )
}
  changeStartDate(event: MatDatepickerInputEvent<Date>) {    
    let formatedDate  = formatDate(new Date(event.target.value), 'yyyy-MM-dd', 'en'); 
    this.startDate=formatedDate
    this.gettransactionBifurcation()
  }
  changeEndDate(event: MatDatepickerInputEvent<Date>) {
    let formatedDate  = formatDate(new Date(event.target.value), 'yyyy-MM-dd', 'en'); 
    this.endDate=formatedDate
    this.gettransactionBifurcation()
  }
}
