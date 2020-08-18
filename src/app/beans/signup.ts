import { InterestedCountry } from './interestedcountry';
import { BlackListedGoods } from './blacklistedgoods';

export interface signup {

	 userId:string;
	 subscriberType:string;
	 bankType:string;
	 firstName:string;
	 lastName:string;
	 emailAddress:string;
	 mobileNum:string;
	 landLinenumber:string;
	 countryName:string;

	 companyName:string;
	 designation:string;
	 businessType:string;

	 minLCValue:string;
	 interestedCountry:InterestedCountry[];
	 blacklistedGoods:BlackListedGoods[];

	 emailAddress1:string;
	 emailAddress2:string;
	 emailAddress3:string;

}