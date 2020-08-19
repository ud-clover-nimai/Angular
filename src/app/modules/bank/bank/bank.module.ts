import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; import { Routes, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { AccountStatusComponent } from 'src/app/nimai/acstatus/account-status/account-status.component';
import { SuccessPopupComponent } from 'src/app/default/popups/success-popup/success-popup.component';
import { ErrorPopupComponent } from 'src/app/default/popups/error-popup/error-popup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { SubscriptionComponent } from 'src/app/nimai/subscription/subscription.component';
import { KycDetailsComponent } from 'src/app/nimai/kyc-details/kyc-details.component';
import { BusinessDetailsComponent } from 'src/app/nimai/business-details/business-details.component';
import { PersonalDetailsComponent } from 'src/app/nimai/personal-details/personal-details.component';
import { DashboardComponent } from 'src/app/nimai/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { NewTransactionComponent } from 'src/app/nimai/bankTransaction/newTransaction/new-transaction/new-transaction.component';
import { ConfirmAndDiscountComponent } from 'src/app/nimai/bankTransaction/newTransaction/quotes/confirm-and-discount/confirm-and-discount.component';
import { BankerComponent } from 'src/app/nimai/bankTransaction/newTransaction/quotes/banker/banker.component';
import { MyProfileComponent } from 'src/app/nimai/my-profile/my-profile.component';
import { ResetPasswordComponent } from 'src/app/default/reset-password/reset-password/reset-password.component';
import { ManageSubsidiaryComponent } from 'src/app/default/manage-subsidiary/manage-subsidiary.component';
import { ChangePasswordComponent } from 'src/app/default/change-password/change-password.component';
import { ReferComponent } from 'src/app/default/refer/refer.component';
import { ActiveTransactionComponent } from 'src/app/nimai/bankTransaction/active-transaction/active-transaction.component';
import { ConfirmationComponent } from 'src/app/nimai/bankTransaction/newTransaction/quotes/confirmation/confirmation.component';
import { DiscountingComponent } from 'src/app/nimai/bankTransaction/newTransaction/quotes/discounting/discounting.component';
import { DraftTransactionComponent } from 'src/app/nimai/bankTransaction/draft-transaction/draft-transaction.component';
import { TrasactionDetailsComponent } from 'src/app/nimai/bankTransaction/trasaction-details/trasaction-details.component';
import { RefinancingComponent } from 'src/app/nimai/bankTransaction/newTransaction/quotes/refinancing/refinancing.component';
import { CreditAndTransactionsComponent } from 'src/app/default/credit-and-transactions/credit-and-transactions/credit-and-transactions.component';
import { ManageUserComponent } from 'src/app/default/manage-user/manage-user/manage-user.component';
import { SupportComponent } from 'src/app/default/support/support/support.component';
import { DasboardDetailsComponent } from 'src/app/nimai/dasboard-details/dasboard-details.component';


const routes: Routes = [
  {
    path: "dsb",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "/dsb/personal-details", pathMatch: "full" },
      {
        path: "personal-details", component: PersonalDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "business-details", component: BusinessDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "kyc-details", component: KycDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      { path: "account-review", component: AccountStatusComponent },
      {
        path: "subscription", component: SubscriptionComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "my-profile", component: MyProfileComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },{
        path: "new-transaction", component: NewTransactionComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "new-request", component: NewTransactionComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "active-transaction", component: ActiveTransactionComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "transaction-details", component: TrasactionDetailsComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "draft-transaction", component: DraftTransactionComponent,
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "change-password", component: ChangePasswordComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "manage-sub", component: ManageSubsidiaryComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "refer", component: ReferComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "credit-transaction", component: CreditAndTransactionsComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "manage-user", component: ManageUserComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "support", component: SupportComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "dashboard-details", component: DasboardDetailsComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      }
    ]
  },




]

@NgModule({
  declarations: [
    NewTransactionComponent,
    ConfirmationComponent,
    DiscountingComponent,
    ConfirmAndDiscountComponent,
    RefinancingComponent,
    BankerComponent,
    ActiveTransactionComponent,
    TrasactionDetailsComponent,
    DraftTransactionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    SharedModule,
  ],
  exports: [
    NewTransactionComponent,
    ConfirmationComponent,
    DiscountingComponent,
    ConfirmAndDiscountComponent,
    RefinancingComponent,
    BankerComponent,
    ActiveTransactionComponent,
    TrasactionDetailsComponent,
    DraftTransactionComponent,
  ]
})
export class BankModule { }
