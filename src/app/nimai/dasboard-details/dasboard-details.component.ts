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
        var data_country=[];
        var Header= ['Country', 'Count'];
        data_country.push(Header);
        for (var i = 0; i < this.piechartcountry.length; i++) {
            var temp=[];
            temp.push(this.piechartcountry[i].countryName);
            temp.push(Number(this.piechartcountry[i].countryCount));
            data_country.push(temp);
        }
        var data_goods=[];
        var Header1= ['Goods', 'Count'];
        var data_goods=[];
        data_goods.push(Header1);
        for (var i = 0; i < this.piechartgoods.length; i++) {
            var temp=[];
            temp.push(this.piechartgoods[i].goodsType);
            temp.push(Number(this.piechartgoods[i].goodsCount));
            data_goods.push(temp);
        }
        google.charts.load('current', {'packages':['corechart','bar']});
        google.charts.setOnLoadCallback(() => this.drawChartForCountry(data_country));
        google.charts.setOnLoadCallback(() => this.drawChartForGoods(data_goods));
        google.charts.setOnLoadCallback(() => this.drawChart2());
      }, (error) => {

      }
    )
  }
   
  drawChartForCountry(data){
      const cdata =new google.visualization.arrayToDataTable(data)
      const options = {
        legend: { 'position': 'top', 'alignment': 'center' },
        pieSliceText: 'value'
      };
      const chart = new google.visualization.PieChart(document.getElementById('pieChart'));
      chart.draw(cdata, options);   
  }
  drawChartForGoods(data){
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
drawChart2(){
  var data = google.visualization.arrayToDataTable([
    ['Year', 'Volume', 'Count'],
    ['Jan', 1000, 2],
    ['Feb', 900, 1],
    ['Mar', 200, 0],
    ['Apr', 400, 2],
    ['May', 5000, 4],
    ['Jun', 1000, 1],
    ['Jul', 2000, 6],
    ['Aug', 50, 8],
    ['Sep', 500, 0],
    ['Oct', 1500, 6],
    ['Nov', 400, 8],
    ['Dec', 600, 9],
 ]);
   
 // Set chart options
 var options = {
    title : 'Cumulative Trxn Amount vs Trxn Count',
    vAxes: {
      "0": {
        title: "amount(USD)"
      },
      "1": {
        title: "Count"
      }
    },
    hAxis: {title: 'Year'},
    seriesType: 'bars',
    //series: {1: {type: 'line'}},
    series: {0: {targetAxisIndex:0},
    1:{targetAxisIndex:1,type: 'line'}
   }
 };

 // Instantiate and draw the chart.
 var chart = new google.visualization.ComboChart(document.getElementById('bar_chart'));
 chart.draw(data, options);
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
