import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { MustMatch } from 'src/app/beans/Validations';
import { loads} from '../../../../assets/js/commons.js';
import * as $ from '../../../../assets/js/jquery.min';
import { TermAndConditionsComponent } from '../../term-and-conditions/term-and-conditions.component.js';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public flag: boolean = false;
  public key: string;
  public resetForm: FormGroup;
  submitted: boolean = false;
  isTextFieldType: boolean;
  isreTextFieldType: boolean;
  public isParent:boolean=false;
  constructor(public router: ActivatedRoute, public route: Router,public lgsc:LoginService,public dialog: MatDialog, public rsc: ResetPasswordService, public fb: FormBuilder) {
    this.router.queryParams.subscribe(params => {
      this.key = params["key"]
    })
    this.rsc.validateToken(this.key).subscribe(
      (response) => {

          let resp=JSON.parse(JSON.stringify(response)).data;
          console.log(resp)
          console.log(resp.userIdentification)
          if(resp.userIdentification== "MASTER")
          {
            this.isParent=false;
          }else{
            this.isParent=true;
          }
        this.flag = true;
      },
      (error) => {
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      }
    )
  }

  ngOnInit() {
   // if()
    loads()
    this.resetForm = this.fb.group({
      emailId: [''],
      userId: [''],
      oldPassword: [''],
      newPassword: ['', [Validators.required,Validators.minLength(6)]],
      retypePaasword: ['' ,[Validators.required,Validators.minLength(6)]],
      termsAndcondition:  [false, Validators.requiredTrue],
      getToken: this.key
    },
    {
      validators: MustMatch('newPassword', 'retypePaasword')
    }
    )
  }
  togglePasswordFieldType(){
    this.isTextFieldType = !this.isTextFieldType;
  }
  togglerePasswordFieldType(){
    this.isreTextFieldType = !this.isreTextFieldType;
  }
  get resetFormDetails() {
    return this.resetForm.controls;
  }

  close(){
    $('#resetId').hide();
    $('.modal-backdrop').hide();

  }

  acceptTerms(){
    var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
    var isChecked = element.checked;
    if(isChecked)
      $('#checkboxError').hide();
    else
      $('#checkboxError').show();      
  }
  submit(){
   
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    //this.submitted = false;
    // var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
    // var isChecked = element.checked;
    // if(isChecked)
    //   $('#checkboxError').hide();
    // else
    //   $('#checkboxError').show();       
  
    this.lgsc.resetPassword(this.resetForm.value)
    .subscribe(
      (response)=>{
        const navigationExtras: NavigationExtras = {
          state: {
            title: 'Your password is set successfully!',
            message: '',
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/success'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      },
      (error)=>{
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      
      }
    )

  }

  




}
