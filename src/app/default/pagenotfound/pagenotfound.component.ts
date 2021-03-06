import { Component, OnInit } from '@angular/core';
import { errorPage404}  from '../../../assets/js/commons'
@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css']
})
export class PagenotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    errorPage404();
  }

}
