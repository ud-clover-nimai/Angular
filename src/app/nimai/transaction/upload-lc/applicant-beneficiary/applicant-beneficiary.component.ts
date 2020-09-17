import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import  { ValidateRegex } from '../../../../beans/Validations';
import * as $ from 'src/assets/js/jquery.min';
import { LoginService } from 'src/app/services/login/login.service';


@Component({
  selector: 'app-applicant-beneficiary',
  templateUrl: './applicant-beneficiary.component.html',
  styleUrls: ['./applicant-beneficiary.component.css']
})
export class ApplicantBeneficiaryComponent implements OnInit {

  @Input() public LcDetail:FormGroup;
  countryName: any;

  constructor(public loginService: LoginService) { }
  ngOnInit() {
    $('#divBene').hide();
    this.onItemChange("Applicant");
    this.getCountryData();

  }

  onItemChange(e){
    var radioValue = $("input[name='userType']:checked").val();
    if (e == "Beneficiary") {
       $('#divApplicant').hide();
       $('#divBene').show();
       this.LcDetail.get('applicantName').setValue('');
       this.LcDetail.get('applicantCountry').setValue('');
       this.LcDetail.get('beneName').setValue(sessionStorage.getItem('companyName'));
       this.LcDetail.get('beneCountry').setValue(sessionStorage.getItem('registeredCountry'));
    }
    else if (e == "Applicant") {
       $('#divApplicant').show();
       $('#divBene').hide();
       this.LcDetail.get('applicantName').setValue(sessionStorage.getItem('companyName'));
       this.LcDetail.get('applicantCountry').setValue(sessionStorage.getItem('registeredCountry'));
       this.LcDetail.get('beneName').setValue('');
       this.LcDetail.get('beneCountry').setValue('');
    }
  }

  getCountryData(){
    this.loginService.getCountryMasterData().
      subscribe(
        (response) => {
          this.countryName = JSON.parse(JSON.stringify(response));
          sessionStorage.setItem('countryData', JSON.stringify(response));
          
        },
        (error) => {}
      )
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
    else if(type=="namewithspace"){
      var key = event.keyCode;
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/ || (event.shiftKey && key === 55) || key===190 /* . key*/)) {
          event.preventDefault();
      }    
    }
  }

}
