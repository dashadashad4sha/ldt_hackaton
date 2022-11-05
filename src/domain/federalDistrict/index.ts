import { makeAutoObservable } from "mobx";

export type FederalDistrictId = number;
export type FederalDistrictCode = string;
export type FederalDistrictName = string;

class FederalDistrictDomain {
	id: FederalDistrictId
	code: FederalDistrictCode
	name:  FederalDistrictName
	constructor(federalDistrict: FederalDistrictDomain){
		makeAutoObservable(this);
		this.id = federalDistrict.id
		this.code = federalDistrict.code
		this.name = federalDistrict.name
	}
}

export default FederalDistrictDomain