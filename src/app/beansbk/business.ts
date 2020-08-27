import { OwnerDetail } from './ownerdetail';

export interface Business{
     userId:string;
	 bankName:string;
	 branchName:string;
	 swiftCode:string;
	 telephone:string;
	 designation:string;
	 comapanyName:string;
	 registeredCountry:string;
	 registrationType:string;
	 provinceName:string;
	 address1:string;
	 address2:string;
	 address3:string;
	 city:string;
	 pincode:string;
	 
	 
	 ownerMasterBean:OwnerDetail[];

	 
}