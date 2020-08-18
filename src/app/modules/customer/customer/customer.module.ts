import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccountStatusComponent } from 'src/app/nimai/acstatus/account-status/account-status.component';
import { UploadLCComponent } from 'src/app/nimai/transaction/upload-lc/upload-lc.component';
import { ActiveTransactionComponent } from 'src/app/nimai/transaction/active-transaction/active-transaction.component';
import { TenorPaymentComponent } from 'src/app/nimai/transaction/upload-lc/tenor-payment/tenor-payment.component';
import { ApplicantBeneficiaryComponent } from 'src/app/nimai/transaction/upload-lc/applicant-beneficiary/applicant-beneficiary.component';
import { OthersComponent } from 'src/app/nimai/transaction/upload-lc/others/others.component';
import { SuccessPopupComponent } from 'src/app/default/popups/success-popup/success-popup.component';
import { ErrorPopupComponent } from 'src/app/default/popups/error-popup/error-popup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { SubscriptionComponent } from 'src/app/nimai/subscription/subscription.component';
import { KycDetailsComponent } from 'src/app/nimai/kyc-details/kyc-details.component';
import { BusinessDetailsComponent } from 'src/app/nimai/business-details/business-details.component';
import { PersonalDetailsComponent } from 'src/app/nimai/personal-details/personal-details.component';
import { DashboardComponent } from 'src/app/nimai/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { UploadLcDetailsCanDeactivate } from 'src/app/services/guards/UploadDetailsCanDeactivate';
import { ConfirmationComponent } from 'src/app/nimai/transaction/transactionTypes/confirmation/confirmation.component';
import { DiscountingComponent } from 'src/app/nimai/transaction/transactionTypes/discounting/discounting.component';
import { ConfirmAndDiscountComponent } from 'src/app/nimai/transaction/transactionTypes/confirm-and-discount/confirm-and-discount.component';
import { RefinancingComponent } from 'src/app/nimai/transaction/transactionTypes/refinancing/refinancing.component';
import { BankerComponent } from 'src/app/nimai/transaction/transactionTypes/banker/banker.component';
import { MyProfileComponent } from 'src/app/nimai/my-profile/my-profile.component';
import { ResetPasswordComponent } from 'src/app/default/reset-password/reset-password/reset-password.component';
import { ManageSubsidiaryComponent } from 'src/app/default/manage-subsidiary/manage-subsidiary.component';
import { ChangePasswordComponent } from 'src/app/default/change-password/change-password.component';
import { ReferComponent } from 'src/app/default/refer/refer.component';
import { TransactionDetailsComponent } from 'src/app/nimai/transaction/transaction-details/transaction-details.component';
import { DraftTransactionComponent } from 'src/app/nimai/transaction/draft-transaction/draft-transaction.component';
import { CreditAndTransactionsComponent } from 'src/app/default/credit-and-transactions/credit-and-transactions/credit-and-transactions.component';
import { SupportComponent } from 'src/app/default/support/support/support.component';
import { UploadLcNewComponent } from 'src/app/nimai/transaction/upload-lc/upload-lc-new/upload-lc-new/upload-lc-new.component';
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
        path: "new-transaction", component: UploadLCComponent, canDeactivate:[UploadLcDetailsCanDeactivate],
        children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "new-transaction-new", component: UploadLcNewComponent, canDeactivate:[UploadLcDetailsCanDeactivate],
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
        path: "transaction-details", component: TransactionDetailsComponent, children: [
          { path: "success", component: SuccessPopupComponent },
          { path: "error", component: ErrorPopupComponent }
        ]
      },
      {
        path: "draft-transaction", component: DraftTransactionComponent, children: [
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
    UploadLCComponent,
    TenorPaymentComponent,
    ApplicantBeneficiaryComponent,
    OthersComponent,
    ActiveTransactionComponent,
    ConfirmationComponent,
    DiscountingComponent,
    ConfirmAndDiscountComponent,
    RefinancingComponent,
    BankerComponent,
    TransactionDetailsComponent,
    DraftTransactionComponent,
    UploadLcNewComponent

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
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule
  ],
  exports: [
    UploadLCComponent,
    TenorPaymentComponent,
    ApplicantBeneficiaryComponent,
    OthersComponent,    
    ActiveTransactionComponent,    
    ConfirmationComponent,
    DiscountingComponent,
    ConfirmAndDiscountComponent,
    RefinancingComponent,
    BankerComponent,
    TransactionDetailsComponent,
    DraftTransactionComponent,
    UploadLcNewComponent

    
  ]
})
export class CustomerModule { }
