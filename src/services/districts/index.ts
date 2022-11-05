import FederalDistrictDomain from "../../domain/federalDistrict";
import { RegionFromServer } from "../../domain/region";
import API from "../api";

const endpoints = {
	federalDistricts: '/customs/federal-district/',
	regions: '/customs/region/'
}

type DistrictsEndpointResponse = {
	federalDistricts: PaginatedResponse<FederalDistrictDomain>
	regions: PaginatedResponse<RegionFromServer>
}

class DistrictsService{
	apiInstance: API
	constructor(apiInstance: API){
		this.apiInstance = apiInstance
	}

	async getDistricts<T extends keyof typeof endpoints>(endpoint: T){
		try{
			const { data } = await this.apiInstance.get<DistrictsEndpointResponse[T]>(endpoints[endpoint]);
			return data;
		} catch (e) {
			throw e;
		}	
	}
}

export default DistrictsService;