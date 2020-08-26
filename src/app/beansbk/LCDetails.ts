
export interface LcDetail {

    userId: string;

    requirementType: string;
    lCIssuanceBank: string;
    lCIssuanceBranch: string;
    swiftCode: string;
    lCIssuanceCountry: string;

    lCValue: number,
    lCCurrency: string;
    lCIssuingDate: string; 
    lastShipmentDate: string;
    negotiationDate: string;
    goodsType:string;


    // For Confirmation 
    paymentPeriod: string;
    paymentTerms: string;
    tenorStartDate:string;
    // tenorEndDate: string;

    // For Discounting 
    discountingPeriod:string;
    remarks:string;

    //For Refinancing
    originalTenorDays:string;
    refinancingPeriod:string;
    lcMaturityDate:string;
	lcNumber:string;
	lastBeneBank:string;
	lastBeneSwiftCode:string;
	lastBankCountry:string;

    
    applicantName: string;
    applicantCountry: string;

    beneName: string;
    beneBankCountry: string;
    beneBankName: string;
    beneSwiftCode: string;
    beneCountry: string;

    loadingCountry: string;
    loadingPort: string;
    dischargeCountry: string;
    dischargePort: string;

    chargesType: string;
    validity: string;
    lcProForma:string;


    lCExpiryDate: string;    
    
    
    insertedDate: string;
    insertedBy: string;
    modifiedDate: string;
    modifiedBy: string;
    transactionflag: string;
    transactionStatus: string;

    userType:string;
    applicantContactPerson:string;
    applicantContactPersonEmail:string;
    beneContactPerson:string;
    beneContactPersonEmail:string;
}