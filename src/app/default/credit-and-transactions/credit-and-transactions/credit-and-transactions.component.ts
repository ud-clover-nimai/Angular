import { Component, OnInit } from '@angular/core';
import { creditTransaction } from  'src/assets/js/commons';

@Component({
  selector: 'app-credit-and-transactions',
  templateUrl: './credit-and-transactions.component.html',
  styleUrls: ['./credit-and-transactions.component.css']
})
export class CreditAndTransactionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    creditTransaction();
  }

}
