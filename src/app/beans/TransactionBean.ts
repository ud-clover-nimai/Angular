export interface TransactionBean{
  transactionId:string;
  userId:string;
  requirementType:string;
  lCIssuanceBank:string;
  lCIssuanceBranch:string;
  swiftCode:number;
  lCIssuanceCountry:string;
  lCIssuingDate: Date;
  lCExpiryDate: Date;
  lCValue: number;
  lCCurrency: string;
  lastShipmentDate:Date;
  negotiationDate:Date;
  paymentPeriod: number;
  paymentTerms: string;
  // tenorEndDate: Date;
  applicantName:string;
  applicantCountry:string;
  beneName: string;
  beneBankCountry: string;
  beneBankName: string;
  beneSwiftCode: string;
  beneCountry:string;
  loadingCountry:string;
  loadingPort:string;
  dischargeCountry:string;
  dischargePort: string;
  chargesType: string;
  validity: Date;
  insertedDate: Date;
  insertedBy: string;
  modifiedDate: Date;
  modifiedBy:string;
  transactionflag: string;
  transactionStatus:string;
  branchUserId: string;
  branchUserEmail: string;
  goodsType: string;
  usanceDays: number;
  startDate: Date;
  endDate: Date;
  originalTenorDays: number;
  refinancingPeriod:string;
  lcMaturityDate: Date,
  lcNumber: string;
  lastBeneBank:string;
  lastBeneSwiftCode:string;
  lastBankCountry: string;
  remarks:string;
  discountingPeriod: string;
  confirmationPeriod: string;
  financingPeriod: string;
  lcProForma: any,
  tenorFile: any,
  lccountry: any[],
  lcgoods: any[],
  lcbanks: any[],
  lcbranch: any[]
}