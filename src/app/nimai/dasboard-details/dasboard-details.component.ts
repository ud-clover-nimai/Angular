import { Component, OnInit } from '@angular/core';

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
    let userId = sessionStorage.getItem('userID');
    if (userId.startsWith('BC') || userId.startsWith('CU') || userId.startsWith('RE')) {
      this.isCustomer = true;
    }
    else if(userId.startsWith('BA')) {
      this.isBank = true;
    }
  }

}
