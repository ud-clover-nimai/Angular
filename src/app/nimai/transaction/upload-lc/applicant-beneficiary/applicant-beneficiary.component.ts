import { Component, OnInit, Input,ElementRef } from '@angular/core';
import  { ValidateRegex } from '../../../../beans/Validations';
import * as $ from 'src/assets/js/jquery.min';
import { LoginService } from 'src/app/services/login/login.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {Validators} from '@angular/forms';
@Component({
  selector: 'app-applicant-beneficiary',
  templateUrl: './applicant-beneficiary.component.html',
  styleUrls: ['./applicant-beneficiary.component.css']
})
export class ApplicantBeneficiaryComponent implements OnInit {

   @Input() public LcDetail:FormGroup;
  countryName: any;
  public hasValue=false;
  public isValidAppEmail=false;
  public isValidBeneEmail=false;
  submitted: boolean;
  constructor(public loginService: LoginService,private el: ElementRef,public fb: FormBuilder) { 
    this.LcDetail = this.fb.group({
     
      swiftCode: ['', Validators.required],
     
           
      applicantName:sessionStorage.getItem('companyName'),
      applicantCountry:sessionStorage.getItem('registeredCountry'),
  
      beneName:sessionStorage.getItem('companyName'),
      beneBankCountry:['', Validators.required],
      beneBankName:['', Validators.required],
      beneSwiftCode:['', Validators.required],
      beneCountry:sessionStorage.getItem('registeredCountry'),
      
     
      applicantContactPerson:['', Validators.required],
      applicantContactPersonEmail:['', Validators.required],
      beneContactPerson:['',Validators.required],
      beneContactPersonEmail:['', Validators.required]
    
  });
  }
  
  


  ngOnInit() {
    $('#divBene').hide();
    this.onItemChange("Applicant");
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));
  }
  onItemChange(e){
    var radioValue = $("input[name='userType']:checked").val();
    this.LcDetail.get('userType').setValue(e);
    if (e == "Beneficiary") {
       $('#divApplicant').hide();
       $('#divBene').show();
       this.LcDetail.get('applicantName').setValue('');
       this.LcDetail.get('applicantCountry').setValue('');
       this.LcDetail.get('beneName').setValue(sessionStorage.getItem('companyName'));
       this.LcDetail.get('beneCountry').setValue(sessionStorage.getItem('registeredCountry'));
       let elements = document.getElementsByTagName('input');
       for (var i = 0; i < elements.length; i++) {
         if(elements[i].value)
         elements[i].classList.add('has-value')
       }
    }
    else if (e == "Applicant") {
       $('#divApplicant').show();
       $('#divBene').hide();
       this.LcDetail.get('applicantName').setValue(sessionStorage.getItem('companyName'));
       this.LcDetail.get('applicantCountry').setValue(sessionStorage.getItem('registeredCountry'));
       this.LcDetail.get('beneName').setValue('');
       this.LcDetail.get('beneCountry').setValue('');
       this.hasValue=true;
    }
  }


  onKeyUpBeneEmail(event){    
    var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
    if(!emailPattern.test(event.target.value))
    {
      this.isValidBeneEmail=true;
    }​else{
      this.isValidBeneEmail=false;
    }
  }
  onKeyUpAppEmail(event){    
    var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
    if(!emailPattern.test(event.target.value))
    {
      this.isValidAppEmail=true;
    }​else{
      this.isValidAppEmail=false;
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
    else if(type=="namewithspace"){
      var key = event.keyCode;
      if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/ || (event.shiftKey && key === 55) || key===190 /* . key*/)) {
          event.preventDefault();
      }    
    }
  }
//   public isValid(data) {
//     console.log(data)
 
//   this.submitted = true;
//   if (this.LcDetail.valid ) {
//     console.log(this.submitted)
// return true;
// } else {
//   console.log(this.submitted)

//   console.log('else')

//   return false;
// }

//  this.submitted = false;
//   }
 }
