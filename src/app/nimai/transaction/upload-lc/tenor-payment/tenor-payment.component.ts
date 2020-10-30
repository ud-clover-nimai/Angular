import { Component, OnInit, Input, ElementRef,ViewChild} from '@angular/core';
import { Subject } from 'rxjs';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import { FormGroup } from '@angular/forms';
import  { ValidateRegex } from '../../../../beans/Validations';
import { uploadFileRefinance } from 'src/assets/js/commons'
import * as $ from 'src/assets/js/jquery.min';
import { LoginService } from 'src/app/services/login/login.service';
@Component({
  selector: 'app-tenor-payment',
  templateUrl: './tenor-payment.component.html',
  styleUrls: ['./tenor-payment.component.css']
})

export class TenorPaymentComponent implements OnInit {
  @Input() public LcDetail:FormGroup;
  @ViewChild('myInput',{ static: true })
  myInputVariable: ElementRef;
  public selector: string;
  public discount: boolean = false;
  public refinancing: boolean = false;
  public confirmation: boolean = true;
  public bankerBool: boolean = false;
  fileToUpload: File = null;
  private imageSrc: string = '';
  public countryName: any;
  isUpload=false;
  private filename: string = '';
  constructor(public rds:DataServiceService,public loginService: LoginService) { 
  }

  ngOnInit() {
   
    $("input[name='optionsRadios']").click(function() {
      var radioValue1 = $("input[name='optionsRadios']:checked").val();
      if (radioValue1 == "rdmaturity") {
           $('.multipledate').hide();
      } else {
          $('.multipledate').show();
      } 
    });
    this.selectors('Confirmation');
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));

  }

  deleteFileContent(){    
    this.myInputVariable.nativeElement.value = ""; 
    this.LcDetail.get('tenorFile').setValue("");
    this.isUpload = false;
    uploadFileRefinance();
  }
 
  public selectors(selector: string) {
    this.selector = selector;
    if (this.selector === 'Discounting') {
      this.discount = true;
      this.confirmation = false;
      this.refinancing = false;
      this.bankerBool = false;
      this.rds.refinance.next(this.refinancing);
    } else if(this.selector === 'Banker'){
      this.discount = true;
      this.confirmation = false;
      this.refinancing = false;
      this.bankerBool = true;
      this.rds.refinance.next(this.refinancing);
    } else if (this.selector === 'Refinance') {
      this.discount = false;
      this.confirmation = false;
      this.refinancing = true;
      this.bankerBool = false;
      this.rds.refinance.next(this.refinancing);
    } else if(this.selector === "ConfirmAndDiscount"){
      this.discount = false;
      this.confirmation = true;
      this.refinancing = false;
      this.bankerBool = false;
      this.rds.refinance.next(this.refinancing);
    } else {
      this.discount = false;
      this.confirmation = true;
      this.refinancing = false;
      this.bankerBool = false;
      this.rds.refinance.next(this.refinancing);
    }



  }

  validateRegexFields(event, type){
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }else if(type == "alphaNumericNoSpace"){
      ValidateRegex.alphaNumericNoSpace(event);
    }
  }

  handleFileInput(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    this.filename=file.name;
      this.isUpload=true;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc =this.filename +" |" + reader.result;
    this.LcDetail.get('tenorFile').setValue(this.imageSrc);

  }

  handleRadio(e, type){
    if(type){
      if(type == "DOM"){
        // this.LcDetail.get('tenorEndDate').setValue('DOM');
      }
      else{
        // this.LcDetail.get('tenorEndDate').setValue(this.LcDetail.get('negotiationDate').value);
      }

    }
    else{
      // this.LcDetail.get('lcMaturityDate').setValue(this.LcDetail.get('lCIssuingDate').value);
    }
  }


}
