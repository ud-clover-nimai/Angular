
export interface NewTransaction {
	id: number;
	beneficiary: string;
	applicant: string;
	country: string;
	txnID: string;
	dateTime: string;
	validity: string;
	ib: string;
	amount: string;
	ccy: string;
	goods: string;
	requirement: string;
	action: string;
}


export interface NTBean {
	bankUserId: '',
	quotationId:'',
	transactionId: string;
	userId: string;
	requirementType: string;
	lCIssuanceBank: string;
	lCIssuanceBranch: string;
	swiftCode: string;
	lCIssuanceCountry: string;
	lCIssuingDate: string;
	lCExpiryDate: string;
	lCValue: string;
	lCCurrency: string;
	lastShipmentDate: string;
	negotiationDate: string;
	paymentPeriod: string;
	paymentTerms: string;
	tenorEndDate: string;
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
	insertedDate: string;
	insertedBy: string;
	modifiedDate: string;
	modifiedBy: string;
	transactionflag: string;
	transactionStatus: string;
	confirmedFlag: string;
	goodsType: string;
	quotationReceived: string;
	quotationStatus:string;

}

export interface PlaceQuote {

	transactionId: String;
	userId: String;
	bankUserId: String;
	quotationId: String;
	confirmationCharges: number;
	confChgsIssuanceToNegot: String;
	confChgsIssuanceToexp: String;
	confChgsIssuanceToMatur: String;
	discountingCharges: number;
	refinancingCharges: String;
	bankAcceptCharges: String;
	applicableBenchmark: number;
	commentsBenchmark: String;
	negotiationChargesFixed: number;
	negotiationChargesPerct: number;
	docHandlingCharges: number;
	otherCharges: number;
	minTransactionCharges: number;
	insertedBy: String;
	modifiedBy: String;
	insertedDate: Date;
	modifiedDate: Date;
	validityDate: Date;
	TotalQuote: number;
	expiryDays: number;
	maturityDays: number;
	negotiationDays: number;
	sumOfQuote: number;
	confChgsMatur: number;
	confChgsNegot: number;
	OtherChargesComments:string;
	termConditionComments:string;
	// added by sanjeev dhiman on Aug 8,2020
	requirementType: string;
	lCIssuanceBank: string;
	lCIssuanceBranch: string;
	swiftCode: string;
	lCIssuanceCountry: string;
	lCIssuingDate: string;
	lCExpiryDate: string;
	lCValue: string;
	lCCurrency: string;
	lastShipmentDate: string;
	negotiationDate: string;
	paymentPeriod: string;
	paymentTerms: string;
	tenorEndDate: string;
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
	transactionflag: string;
	transactionStatus: string;
	confirmedFlag: string;
	goodsType: string;
	quotationReceived: string;
	discountingPeriod:string;
	confirmationPeriod:string;
	refinancingPeriod:string;
	quotationStatus:string;
}


export interface editViewQuotation {
	acceptedOn: Date;
	applicableBenchmark: number;
	applicantName: String;
	bankUserId: String;
	bankerAcceptCharges: number;
	beneName: String;
	chargesType: String;
	commentsBenchmark: String;
	confChgsIssuanceToExp: String;
	confChgsIssuanceToMatur: String;
	confChgsIssuanceToNegot: String;
	confirmationCharges: number;
	discountingCharges: number;
	docHandlingCharges: number;
	goodsType: String;
	lCIssuanceBank: String;
	lCValue: number;
	minTransactionCharges: number;
	negotiationChargesFixed: number;
	negotiationChargesPerct: number;
	otherCharges: number;
	quotationId: number;
	quotationPlaced: String;
	refinancingCharges: number;
	requirementType: String;
	totalQuoteValue: number;
	transactionId: String;
	transactionStatus: String;
	userId: String;
	validity: Date;
	validityDate: Date;
	quotationStatus:string;
	//added by sanjeev dhiman
	discountingPeriod:string;
	refinancingPeriod:string;
}

export interface newTransactionBean {
	transactionId: string;
	userId: string;
	requirementType: string;
	lCIssuanceBank: string;
	lCIssuanceBranch: string;
	swiftCode: number;
	lCIssuanceCountry: string;
	lCIssuingDate: Date;
	lCExpiryDate: Date;
	lCValue: number;
	lCCurrency: string;
	lastShipmentDate: Date;
	negotiationDate: Date;
	paymentPeriod: number;
	paymentTerms: string;
	tenorEndDate: Date;
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
	validity: Date;
	insertedDate: Date;
	insertedBy: string;
	modifiedDate: Date;
	modifiedBy: string;
	transactionflag: string;
	transactionStatus: string;
	branchUserId: string;
	branchUserEmail: string;
	goodsType: string;
	usanceDays: number;
	startDate: Date;
	endDate: Date;
	originalTenorDays: number;
	refinancingPeriod: string;
	lcMaturityDate: Date,
	lcNumber: string;
	lastBeneBank: string;
	lastBeneSwiftCode: string;
	lastBankCountry: string;
	remarks: string;
	discountingPeriod: string;
	confirmationPeriod: string;
	financingPeriod: string;
	lcProForma: any;
	tenorFile: any;
	lccountry: any[];
	lcgoods: any[];
	lcbanks: any[];
	lcbranch: any[];
	applicantContactPersonEmail:string;
	beneContactPerson:string;
	beneContactPersonEmail:string;
	userType:string;
	applicantContactPerson:string;
	closedQuote:string;
	quotationStatus:string;
}