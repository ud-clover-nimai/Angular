import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.css']
})
export class OnlinePaymentComponent implements OnInit {
  hiddenfields: boolean=false;

  constructor() { }

  ngOnInit() {
    this.hiddenfields=true;
  }
  submit(){
    
  }
}
