import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './default/login/login.component';
import { PersonalDetailsComponent } from './nimai/personal-details/personal-details.component';
import { PagenotfoundComponent } from './default/pagenotfound/pagenotfound.component';
import { DashboardComponent } from './nimai/dashboard/dashboard.component';
import { BusinessDetailsComponent } from './nimai/business-details/business-details.component';

import { KycDetailsComponent } from './nimai/kyc-details/kyc-details.component';
import { SubscriptionComponent } from './nimai/subscription/subscription.component';
import { SuccessPopupComponent } from './default/popups/success-popup/success-popup.component';
import { ErrorPopupComponent } from './default/popups/error-popup/error-popup.component';
import { ResetPasswordComponent } from './default/reset-password/reset-password/reset-password.component';

import { ActiveTransactionComponent } from './nimai/active-transaction/active-transaction.component';
import { UploadLCComponent } from './nimai/transaction/upload-lc/upload-lc.component';
import { AccountStatusComponent } from './nimai/acstatus/account-status/account-status.component';
import { ForgotPasswordComponent } from './default/forgot-password/forgot-password.component';
import { CustomerCanActiveService } from './services/guards/CustomerCanActive.service';
import { BankCanActiveService } from './services/guards/BankCanActive.service';
import { CustomerLoginComponent } from './default/popups/customer-login/customer-login.component';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login", component: LoginComponent,
    children: [
      { path: "success", component: SuccessPopupComponent },
      { path: "error", component: ErrorPopupComponent },
      { path: "custPopup", component: CustomerLoginComponent } 
    ]
  },
  {
    path: "forgetpassword", component: ForgotPasswordComponent, children: [
      { path: "success", component: SuccessPopupComponent },
      { path: "error", component: ErrorPopupComponent }
    ]
  },
  {
    path: "accountactivation", component: ResetPasswordComponent, children: [
      { path: "success", component: SuccessPopupComponent },
      { path: "error", component: ErrorPopupComponent }
    ]
  },
  {
    path: 'cst', canActivate: [CustomerCanActiveService], loadChildren: () => import('./modules/customer/customer/customer.module').then(module => module.CustomerModule)
  },
  {
    path: 'bcst', canActivate: [BankCanActiveService], loadChildren: () => import('./modules/bank/bank/bank.module').then(module => module.BankModule)
  },
  {
    path: 'ref',  loadChildren: () => import('./modules/reffer/reffer.module').then(module => module.RefferModule)
  },
  { path: "**", component: PagenotfoundComponent },
  { path: "page-not-found", component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
