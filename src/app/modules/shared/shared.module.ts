import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStatusComponent } from 'src/app/nimai/acstatus/account-status/account-status.component';
import { SuccessPopupComponent } from 'src/app/default/popups/success-popup/success-popup.component';
import { ErrorPopupComponent } from 'src/app/default/popups/error-popup/error-popup.component';
import { SubscriptionComponent } from 'src/app/nimai/subscription/subscription.component';
import { KycDetailsComponent } from 'src/app/nimai/kyc-details/kyc-details.component';
import { BusinessDetailsComponent } from 'src/app/nimai/business-details/business-details.component';
import { PersonalDetailsComponent } from 'src/app/nimai/personal-details/personal-details.component';
import { DashboardComponent } from 'src/app/nimai/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { LoaderServiceService } from 'src/app/services/loader/loader-service.service';
import { LoaderInterceptorService } from 'src/app/services/interceptors/loader/loader-interceptor.service';
import { LoaderComponent } from 'src/app/default/popups/loader/loader/loader.component';
import { MyProfileComponent } from 'src/app/nimai/my-profile/my-profile.component';
import { ResetPasswordComponent } from 'src/app/default/reset-password/reset-password/reset-password.component';
import { ManageSubsidiaryComponent } from 'src/app/default/manage-subsidiary/manage-subsidiary.component';
import { ChangePasswordComponent } from 'src/app/default/change-password/change-password.component';
import { ReferComponent } from 'src/app/default/refer/refer.component';
import { CreditAndTransactionsComponent } from 'src/app/default/credit-and-transactions/credit-and-transactions/credit-and-transactions.component';
import { ManageUserComponent } from 'src/app/default/manage-user/manage-user/manage-user.component';
import { SupportComponent } from 'src/app/default/support/support/support.component';
import { weightDirective } from './directive/weight.directive';
import { DasboardDetailsComponent } from 'src/app/nimai/dasboard-details/dasboard-details.component';



@NgModule({
  declarations: [
    AccountStatusComponent,    
    DashboardComponent,
    PersonalDetailsComponent,
    BusinessDetailsComponent,
    KycDetailsComponent,
    SubscriptionComponent,    
    SuccessPopupComponent,
    ErrorPopupComponent,           
    LoaderComponent,
    MyProfileComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ManageSubsidiaryComponent,
    ReferComponent,
    CreditAndTransactionsComponent,
    ManageUserComponent,
    SupportComponent,
    weightDirective,
    DasboardDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports:[
    AccountStatusComponent,    
    DashboardComponent,
    PersonalDetailsComponent,
    BusinessDetailsComponent,
    KycDetailsComponent,
    SubscriptionComponent,    
    SuccessPopupComponent,
    ErrorPopupComponent,          
    LoaderComponent,
    MyProfileComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ManageSubsidiaryComponent,
    ManageUserComponent,
    ReferComponent,
    CreditAndTransactionsComponent,
    SupportComponent,
    weightDirective,
    DasboardDetailsComponent
  ],
  providers: [MatDatepickerModule,
    LoaderServiceService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ],
})
export class SharedModule { }
