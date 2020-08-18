import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MustMatch } from 'src/app/beans/Validations';
import * as $ from 'src/assets/js/jquery.min';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { ChangePassword } from 'src/app/beans/login';
import { loads} from '../../../assets/js/commons'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";

  constructor(public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public loginService: LoginService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

  }

  changePasswordForm = this.formBuilder.group({
    oldpassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', [Validators.required])
  }, {
    validators: MustMatch('newPassword', 'confirmPassword')
  });

  get changePassDetails() {
    return this.changePasswordForm.controls;
  }

  ngOnInit() {
    loads();
  }

  close() {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/business-details`])
  }

  onSubmit() {
    console.log(this.changePasswordForm.value)
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.submitted = false;
    $('.modal1').hide();

    let data: ChangePassword = {
      userId: sessionStorage.getItem('userID'),
      oldPassword: this.changePasswordForm.get('oldpassword').value,
      newPassword: this.changePasswordForm.get('newPassword').value,
      retypePaasword: this.changePasswordForm.get('confirmPassword').value,
    }

    this.loginService.changePassword(data).
      subscribe(
        (response) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congratulations! Your Password has been successfully Changed!',
              message: 'Kindly login with new Password',
              parent: 'login'
            }
          };
          this.router.navigate(['/login/success'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        },
        (error) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Old Password is incorrect!',
              message: 'Kindly check the password and try again!',
              parent: this.subURL + '/' + this.parentURL + '/business-details'
            }
          };
        this.router.navigate([`/${this.subURL}/${this.parentURL}/business-details/error`], navigationExtras)
            .then(success => console.log('navigation ?', success))
            .catch(console.error);
        }
      )
  }
}