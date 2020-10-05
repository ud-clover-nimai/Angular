import { Component, OnInit } from '@angular/core';
import { dashboard_details } from 'src/assets/js/commons';

@Component({
  selector: 'app-dasboard-details',
  templateUrl: './dasboard-details.component.html',
  styleUrls: ['./dasboard-details.component.css']
})
export class DasboardDetailsComponent implements OnInit {
  isCustomer: boolean = false;
  isBank: boolean = false;

  constructor() { }

  ngOnInit() {
    dashboard_details();
  }
  //   let userId = sessionStorage.getItem('userID');
  //   if (userId.startsWith('BC') || userId.startsWith('CU') || userId.startsWith('RE')) {
  //     this.isCustomer = true;
  //   }
  //   else if(userId.startsWith('BA')) {
  //     this.isBank = true;
  //   }
  // }

}
