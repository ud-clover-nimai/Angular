import { Component, OnInit } from '@angular/core';
import { TransactionBean } from 'src/app/beans/TransactionBean';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { Tflag } from 'src/app/beans/Tflag';
import { ActivatedRoute, Router } from '@angular/router';
import { TData } from 'src/app/beans/TransBean';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-refinancing',
  templateUrl: './refinancing.component.html',
  styleUrls: ['./refinancing.component.css']
})
export class RefinancingComponent implements OnInit {

  public isActive: boolean = false;
  public data:TData;
  public title: string = "";
  public tab = 'tab2';
  document: any;
  public parentURL: string = "";
  public subURL: string = "";
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  countryName: any;

  constructor(public loginService: LoginService,public titleService: TitleService, public ts: NewTransactionService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    this.data = {
      originalTenorDays:"",
      refinancingPeriod:"",
      lcMaturityDate:"",
      lcNumber:"",
      lastBeneBank:"",
      lastBeneSwiftCode:"",
      lastBankCountry:"",
      loadingCountry:"",
      loadingPort:"",
      dischargeCountry:"",
      dischargePort:"",
      chargesType:"",
      validity:"",
      lcProForma:"",
      applicantName:"",
      applicantCountry:"",
      userType:"",
      applicantContactPerson:"",
      applicantContactPersonEmail:"",
      beneName:"",
      beneCountry:"",
      beneContactPerson:"",
      beneContactPersonEmail:"",
      beneBankName:"",
      beneSwiftCode:"",
      beneBankCountry:"",
      lCIssuanceBank:"",
      lCIssuanceBranch:"",
      swiftCode:"",
      lCIssuanceCountry:"",
      requirementType:"",
      lCValue:"",
      lCCurrency:"",
      lCIssuingDate:"",
      negotiationDate:"",
      lastShipmentDate:"",
      goodsType:"",
      discountingPeriod:"",
      confirmationPeriod:"",
      paymentTerms:"",    
    }
    
    
  }

  ngOnInit() {
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));

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
    
    if(data.lcProForma==null || data.lcProForma=="" || data.lcProForma==undefined){
      this.noFileDisable=false;
      this.viewDisable=true;

     }else{
      this.viewDisable=false;
      this.noFileDisable=true;
     }

  }

  public closed() {
    this.isActive = false;
    this.titleService.quote.next(false);
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
    $('#myModalR').show();
    this.document = file;
  }

  // handleFileInput31(e) {
  //   var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  //   var pattern = /image-*/;
  //   var reader = new FileReader();
  //   if (!file.type.match(pattern)) {
  //     alert('invalid format');
  //     $('#upload_file2').val('');
  //     return;
  //   }
  //   else{
  //     reader.onload = this._handleReaderLoaded.bind(this);
  //     reader.readAsDataURL(file);
  //   }
    
  // }
  // _handleReaderLoaded(e) {
  //   let reader = e.target;
  //   this.imageSrc = reader.result;
  //   this.LcDetail.get('lcProForma').setValue(this.imageSrc);

  // }

}
