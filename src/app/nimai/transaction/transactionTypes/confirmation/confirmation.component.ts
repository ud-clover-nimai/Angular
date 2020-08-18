import { Component, OnInit, ViewChild } from '@angular/core';
import { Tflag } from 'src/app/beans/Tflag';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { TransactionBean } from 'src/app/beans/TransactionBean';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { ActiveTransactionComponent } from 'src/app/nimai/active-transaction/active-transaction.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  @ViewChild(ActiveTransactionComponent, { static: true }) activeTransaction: ActiveTransactionComponent;

  public isActive: boolean = false;
  public data = {};
  public title: string = "";
  public tab = 'tab2';
  document: any;
  public parentURL: string = "";
  public subURL: string = "";

  constructor(public titleService: TitleService, public ts: NewTransactionService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    
  }

  ngOnInit() {
  }

  public action(flag: boolean, type: Tflag, data: any) {
  
    if (flag) {
      this.isActive = flag;
      if (type === Tflag.VIEW) {
        // $('input').attr('readonly', true);
        this.title = 'View';
        this.data = data;
      } else if (type === Tflag.EDIT) {
        this.title = 'Edit';
        this.data = data;
        // $('input').attr('readonly', false);
      }
    } else {
      this.isActive = flag;
      this.data = data;
      this.title = '';
      // $('input').attr('readonly', true);

    }
  }

  public closed() {
    this.isActive = false;
    // this.titleService.quote.next(false);
  }

  closed_div(){
    this.isActive = false;
    document.getElementById("menu-barnew").style.width = "0%"; 
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
   }
  public transaction(act: string) {

    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        setTimeout(() => {
          // $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'submit': {
        this.ts.updateCustomerTransaction(this.data).subscribe(
          (response) => {
            this.tab = 'tab3';
            
          },
          error => {
            alert('error')
          }
        )


      }
        break;
      case 'ok': {

        this.closed();
        this.tab = 'tab1';
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
      });
      }
        break;
      case 'preview': {
        this.tab = 'tab2';
        setTimeout(() => {
          // $('input').attr('readonly', true);
        }, 200);
      }
        break;
    }

  }

  close(){
    $('.modal3').hide();
  }

  openDocument(file){
    $('#myModalC').show();
    this.document = file;
  }

}
