import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from '../../../../assets/js/jquery.min';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent implements OnInit {
  public title: string;
  public message: string;
  public parent :string;

  constructor(public router: Router) {

    let navigation = this.router.getCurrentNavigation();
    console.log(navigation)
    const state = navigation.extras.state as {
      title: string,
      message: string,
       parent:string
    };
    this.title = state.title;
    this.message = state.message;
    this.parent = state.parent;
   }

  ngOnInit() {
    
  }

  close() {
    $('.modal').hide();
    if(this.parent === 'login'){
      this.router.navigate(['/'+this.parent]);
    } else if(this.parent === "accountactivation"){
      this.router.navigate(['/'+this.parent]);
    } else if(this.parent === "forgetpassword"){
      this.router.navigate(['/'+this.parent]);
    } else{
      this.router.navigate(['/'+this.parent]);
    }
   

  }

}
