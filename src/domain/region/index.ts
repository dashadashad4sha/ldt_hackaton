import { makeAutoObservable } from "mobx";
import { FederalDistrictId } from "../federalDistrict";

export type RegionId = string;
export type RegionCode = string;
export type RegionName = string;

export type RegionFromServer = {
	regionId: RegionId,
	regionCode: RegionCode,
	regionName: RegionName,
	federalDistrict: FederalDistrictId,
}

class RegionDomain {
	id: RegionId
	code: RegionCode
	name: RegionName
	federalDistrict: FederalDistrictId
	constructor(region: RegionDomain){
		makeAutoObservable(this);
		this.id = region.id
		this.code = region.code
		this.name = region.name
		this.federalDistrict = region.federalDistrict
	}

	static regionFromServer(data: RegionFromServer) {
		return new RegionDomain({
			id: data.regionId,
			code: data.regionCode,
			name: data.regionName,
			federalDistrict: data.federalDistrict
		})
	}
}

export default RegionDomain;