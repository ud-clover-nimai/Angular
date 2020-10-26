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
  isReferrer: boolean = false;
  dashboardData:any;
  custmrdasbrdcount:any;
  referCumulativetrxn:any;
  referrerEarning:any;
  referrerdashbrdcount:any;
  transactionbifurcation:any;
  latestacceptedtrxn:any;
  public piechartcountry:any;
  public piechartgoods:any;
  public cumulativetrxnAmnt:any;
  bankdashbrdcount:any;
  bankBarChart:any;
  banklatestaccepttrxn:any;
  userId:any;
  country:any;
  selectedCountry:any;
  selectedProduct:any;
  public startDate:any;
  public endDate:any;
  @ViewChild('pieChart', { static: true }) pieChart: ElementRef
  constructor(public service: DashboardDetailsService) { }
  ngOnInit() {
    this.userId=sessionStorage.getItem('userID')
    if(this.userId.startsWith('CU')){
      this.isCustomer=true;
      this.getCustomerDashboardDetails();
    }else if(this.userId.startsWith('BC')){
      this.isBank=true;
      this.selectedCountry=""
      this.selectedProduct=""
      this.getBankDashboardDetails();
      this.getCountryList()

    }else if(this.userId.startsWith('RE')){
      this.isReferrer=true;
      this.getReferrerDashboardDetails();
    }  
  }
  getReferrerDashboardDetails(){
    const param = {
      userId:this.userId,
      year:"2020",
    }
    this.service.getReferrerDashboardDetails(param).subscribe(
      (response) => {   
   //this.dashboardData =JSON.parse(JSON.stringify({"message":null,"data":{"referCumulativetrxn":[{"id":529,"transaction_Amount":0,"month":"January","count":0},{"id":530,"transaction_Amount":0,"month":"February","count":0},{"id":531,"transaction_Amount":0,"month":"March","count":0},{"id":532,"transaction_Amount":0,"month":"April","count":0},{"id":533,"transaction_Amount":335000,"month":"May","count":2},{"id":534,"transaction_Amount":0,"month":"June","count":0},{"id":535,"transaction_Amount":0,"month":"July","count":0},{"id":536,"transaction_Amount":0,"month":"August","count":0},{"id":537,"transaction_Amount":895213,"month":"September","count":5},{"id":538,"transaction_Amount":10,"month":"October","count":1},{"id":539,"transaction_Amount":125000,"month":"November","count":1},{"id":540,"transaction_Amount":0,"month":"December","count":0}],"referdashbrdCount":[{"id":125,"count":4,"detail":"ToatalReferences"},{"id":126,"count":2,"detail":"ApprovedReferences"},{"id":127,"count":1,"detail":"PendingReferences"},{"id":128,"count":1,"detail":"RejectedReferences"}],"referEarnings":[{"id":38,"earning":300}]},"list":null,"errCode":null,"status":"Success"})).data;
    this.dashboardData=JSON.parse(JSON.stringify(response)).data;
    this.referrerdashbrdcount=this.dashboardData.referdashbrdCount;
    this.referrerEarning=this.dashboardData.referEarnings[0].earning;
    this.referCumulativetrxn=this.dashboardData.referCumulativetrxn
    var header_amount= ['Month', 'Volume transacted by references','Transaction by references'];
    var data_amount=[];
    data_amount.push(header_amount);
    for (var i = 0; i < this.referCumulativetrxn.length; i++) {
        var temp=[];
        temp.push(this.referCumulativetrxn[i].month);
        temp.push(Number(this.referCumulativetrxn[i].transactionAmount));
        temp.push(Number(this.referCumulativetrxn[i].count));
        data_amount.push(temp);
    }
    
    google.charts.load('current', {'packages':['corechart','bar']});
    google.charts.setOnLoadCallback(() => this.drawChart2(data_amount));
      }, (error) => {

      }
    )
  }
  public onYearSelected(event){
    const value = event.target.value;
    const param = {
      userId: this.userId,
      year: value,
    }
      this.service.getReferrerDashboardDetails(param).subscribe(
      (response) => {
        this.dashboardData=JSON.parse(JSON.stringify(response)).data;
        this.referrerdashbrdcount=this.dashboardData.referdashbrdCount;
         if(this.dashboardData.referCumulativetrxn)
            this.referCumulativetrxn=this.dashboardData.referCumulativetrxn
          else  
            this.referCumulativetrxn=""
            var header_amount= ['Month', 'Volume transacted by references','Transaction by references'];
            var data_amount=[];
            data_amount.push(header_amount);
            for (var i = 0; i < this.referCumulativetrxn.length; i++) {
                var temp=[];
                temp.push(this.referCumulativetrxn[i].month);
                temp.push(Number(this.referCumulativetrxn[i].transactionAmount));
                temp.push(Number(this.referCumulativetrxn[i].count));
                data_amount.push(temp);
            }
            
            google.charts.load('current', {'packages':['corechart','bar']});
            google.charts.setOnLoadCallback(() => this.drawChart2(data_amount));
  
      }, (error) => {
  
      }
    )
  }
    public onYearSelected_1(event){
    const value = event.target.value;
    const param = {
      userId: this.userId,
      year: value,
    }
      this.service.getReferrerDashboardDetails(param).subscribe(
      (response) => {
        this.dashboardData=JSON.parse(JSON.stringify(response)).data;
        this.referrerEarning=this.dashboardData.referEarnings[0].earning;
  
      }, (error) => {
  
      }
    )
  }
  getCountryList(){
    this.service.viewCountryList().subscribe(
        (response) => {
          this.country = JSON.parse(JSON.stringify(response)).data;

        },
        (error) => {}
      )
  }
  onCountrySelected(event){ 
  if(event.target.value)
    this.selectedCountry=event.target.value
  else  
     this.selectedCountry=event.target.value
    this.getBankDashboardDetails()   
  }
  onProductSelected(event){
    if(event.target.value)
      this.selectedProduct=event.target.value
    else  
      this.selectedProduct=""
    this.getBankDashboardDetails()  
  }
  getBankDashboardDetails(){
    const param = {
      userId:this.userId,
      country:this.selectedCountry,
      productRequirement:this.selectedProduct
    }
    this.service.getBankDashboardDetails(param).subscribe(
      (response) => {
        this.dashboardData = JSON.parse(JSON.stringify(response)).data;
        this.bankdashbrdcount=this.dashboardData.bankdashbrdcount;
        this.bankBarChart=this.dashboardData.bankBarChart
        this.banklatestaccepttrxn=this.dashboardData.banklatestaccepttrxn
        var header_country= ['country', 'Transaction available','Transaction quote'];
        var data_country=[];
        data_country.push(header_country);
        for (var i = 0; i < this.bankBarChart.length; i++) {
            var temp=[];
            temp.push(this.bankBarChart[i].country);
            temp.push(Number(this.bankBarChart[i].transactionavailable));
            temp.push(Number(this.bankBarChart[i].transactionquote));
            data_country.push(temp);
        }
        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(() => this.drawBarChartCountry(data_country));
      }, (error) => {

      }
    )
  }
 
  drawBarChartCountry(data){
    var data = google.visualization.arrayToDataTable(data);
    var options = {
      chart: {
        title: ''
      }
    };

    var chart = new google.charts.Bar(document.getElementById('bar_chart_country'));
    chart.draw(data, google.charts.Bar.convertOptions(options));
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
