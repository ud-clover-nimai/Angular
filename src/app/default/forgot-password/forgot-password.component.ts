import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MustMatch } from 'src/app/beans/Validations';
import { loads } from '../../../assets/js/commons';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public flag: boolean = false;
  public key: string;
  public forgetPassword: FormGroup;
  public userID: string = null;
  submitted: boolean = false;
  isTextFieldType: boolean;
  isreTextFieldType: boolean;
  constructor(public router: ActivatedRoute, public route: Router, public lgsc: LoginService, public rsc: ForgetPasswordService, public fb: FormBuilder) {
    this.router.queryParams.subscribe(params => {
      this.key = params["key"]
    })
    this.rsc.validateToken(this.key).subscribe(
      (response) => {
        this.flag = true;
        this.lgsc.findUserByToken(this.key)
        .subscribe(
          (response)=>{
            this.userID = JSON.parse(JSON.stringify(response)).data;
          }
        )
      },
      (error) => {
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'forgetpassword'
          }
        };
        this.route.navigate(['/forgetpassword/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      }
    )
    this.forgetPassword = this.fb.group({      
      password: ['', [Validators.required,Validators.minLength(6)]],
      rePassword: ['', [Validators.required,Validators.minLength(6)]]
    },
    {
      validators: MustMatch('password', 'rePassword')
    }
    )
  }

  ngOnInit() {
    loads();
  }
  togglePasswordFieldType(){
    this.isTextFieldType = !this.isTextFieldType;
  }
  togglerePasswordFieldType(){
    this.isreTextFieldType = !this.isreTextFieldType;
  }
  returntologin(){
    this.route.navigate(['/login']);
  }
  get forgetPasswordDetails() {
    return this.forgetPassword.controls;
  }

  public save() {
    this.submitted = true;                                                                           
    if (this.forgetPassword.invalid) {
      return;
    }
    this.submitted = false;

   let data={
    emailId:'',
    userId: this.userID,
    oldPassword: '',
    newPassword: this.forgetPassword.get('password').value,
    retypePaasword:this.forgetPassword.get('password').value,
    getToken: this.key
   }

   this.lgsc.resetPassword(data)
   .subscribe(
     (response)=>{
       const navigationExtras: NavigationExtras = {
         state: {
           title: 'Congratulations! Your password is set successfully!',
           message: 'Kindly login with new Password',
           parent: 'forgetpassword'
         }
       };
       this.route.navigate(['/forgetpassword/success'], navigationExtras)
         .then(success => console.log('navigation success?', success))
         .catch(console.error);
     },
     (error)=>{
       const navigationExtras: NavigationExtras = {
         state: {
           title: JSON.parse(JSON.stringify(error)).error.errMessage,
           message: '',
           parent: 'forgetpassword'
         }
       };
       this.route.navigate(['/forgetpassword/error'], navigationExtras)
         .then(success => console.log('navigation success?', success))
         .catch(console.error);
     
     }
   )

  }

}
