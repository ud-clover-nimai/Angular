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
  bankdashbrdcount:any;
  custmrdasbrdcount:any;
  transactionbifurcation:any;
  latestacceptedtrxn:any;
  public piechartcountry:any;
  public piechartgoods:any;
  public cumulativetrxnAmnt:any;
  userId:any;
  selected:any;
  public startDate:any;
  public endDate:any;
  @ViewChild('pieChart', { static: true }) pieChart: ElementRef
  constructor(public service: DashboardDetailsService) { }
  ngOnInit() {
    this.userId=sessionStorage.getItem('userID')
    if(this.userId.startsWith('CU')){
      this.isCustomer=true;
      this.getCustomerDashboardDetails();
    }else{
      this.isCustomer=false;
      this.getBankDashboardDetails();
    }  
  }
  getBankDashboardDetails(){
    const param = {
      userId: this.userId,
      country: "",
      productRequirement:"",
    }
    this.service.getBankDashboardDetails(param).subscribe(
      (response) => {
        this.dashboardData = JSON.parse(JSON.stringify(response)).data;
        this.bankdashbrdcount=this.dashboardData.bankdashbrdcount   
        
      }, (error) => {

      }
    )
  }
  getCustomerDashboardDetails(){
    const param = {
      userId: this.userId,
      year: "2020",
      startDate:"",
      endDate:""
    }

    this.service.getCustomerDashboardDetails(param).subscribe(
      (response) => {
        this.dashboardData = JSON.parse(JSON.stringify(response)).data;
        this.custmrdasbrdcount=this.dashboardData.custmrdasbrdcount
        this.transactionbifurcation=this.dashboardData.transactionbifurcation
        this.latestacceptedtrxn=this.dashboardData.latestacceptedtrxn
        this.piechartcountry=this.dashboardData.piechartcountry
        this.piechartgoods=this.dashboardData.piechartgoods
        this.cumulativetrxnAmnt=this.dashboardData.cumulativetrxnAmnt
        var data_country=[];
        var header_country= ['Country', 'Count'];
        data_country.push(header_country);
        for (var i = 0; i < this.piechartcountry.length; i++) {
            var temp=[];
            temp.push(this.piechartcountry[i].countryName);
            temp.push(Number(this.piechartcountry[i].countryCount));
            data_country.push(temp);
        }
        var header_goods= ['Goods', 'Count'];
        var data_goods=[];
        data_goods.push(header_goods);
        for (var i = 0; i < this.piechartgoods.length; i++) {
            var temp=[];
            temp.push(this.piechartgoods[i].goodsType);
            temp.push(Number(this.piechartgoods[i].goodsCount));
            data_goods.push(temp);
        }
        var header_amount= ['Month', 'Volume','Count'];
        var data_amount=[];
        data_amount.push(header_amount);
        for (var i = 0; i < this.cumulativetrxnAmnt.length; i++) {
            var temp=[];
            temp.push(this.cumulativetrxnAmnt[i].month);
            temp.push(Number(this.cumulativetrxnAmnt[i].transactionAmount));
            temp.push(Number(this.cumulativetrxnAmnt[i].count));
            data_amount.push(temp);
        }
        
        google.charts.load('current', {'packages':['corechart','bar']});
        google.charts.setOnLoadCallback(() => this.drawChartForCountry(data_country));
        google.charts.setOnLoadCallback(() => this.drawChartForGoods(data_goods));
        google.charts.setOnLoadCallback(() => this.drawChart2(data_amount));
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
drawChart2(data){
  var data = google.visualization.arrayToDataTable(data);
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
if(this.startDate && this.endDate)
{
  this.service.getCustomerDashboardDetails(param).subscribe(
    (response) => {
      this.dashboardData = JSON.parse(JSON.stringify(response)).data;
      this.transactionbifurcation=this.dashboardData.transactionbifurcation
    }, (error) => {

    }
  )
}  
}
public onOptionsSelected(event) {
  const value = event.target.value;
  console.log(value);
  const param = {
    userId: this.userId,
    year: value,
    startDate:"",
    endDate:""
  }

  this.service.getCustomerDashboardDetails(param).subscribe(
    (response) => {
      this.dashboardData = JSON.parse(JSON.stringify(response)).data;
       if(this.dashboardData.cumulativetrxnAmnt)
          this.cumulativetrxnAmnt=this.dashboardData.cumulativetrxnAmnt
        else  
          this.cumulativetrxnAmnt=""
      var header_amount= ['Month', 'Volume','Count'];
      var data_amount=[];
      data_amount.push(header_amount);
      for (var i = 0; i < this.cumulativetrxnAmnt.length; i++) {
          var temp=[];
          temp.push(this.cumulativetrxnAmnt[i].month);
          temp.push(Number(this.cumulativetrxnAmnt[i].transactionAmount));
          temp.push(Number(this.cumulativetrxnAmnt[i].count));
          data_amount.push(temp);
      }
      google.charts.load('current', {'packages':['corechart','bar']});
      google.charts.setOnLoadCallback(() => this.drawChart2(data_amount));

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
