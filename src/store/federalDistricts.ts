import { makeAutoObservable, runInAction } from "mobx";
import CountryDomain from "../domain/country";
import FederalDistrictDomain from "../domain/federalDistrict";
import RegionDomain, { RegionCode } from "../domain/region";
import API from "../services/api";
import DistrictsService from "../services/districts";
import { dataFormatters } from "../utils";

class FederalDistrictsStore {
	districts: FederalDistrictDomain[] = [];
	regions: RegionDomain[] = [];
	countries: CountryDomain[] = [];
	defaultRegionCode: RegionCode = '45000';
	private districtService: DistrictsService
	constructor(apiInstance: API){
		makeAutoObservable(this);
		this.districtService = new DistrictsService(apiInstance);
	}

	async getRegions(){
		try{
			const districts = await this.districtService.getDistricts('regions');
			runInAction(() => {
				this.regions = districts.results.map((region) => RegionDomain.regionFromServer(dataFormatters.camelize(region)))
			})
		} catch(e){
			console.error(e)
		}
	}

	async getDistricts(){
		try{
			const districts = await this.districtService.getDistricts('federalDistricts');
			runInAction(() => {
				this.districts = districts.results.map((district) => new FederalDistrictDomain(dataFormatters.camelize(district)))
			})
		} catch(e){
			console.error(e)
		}
	}

	async getCountries(){
		try {
			const countries = await this.districtService.getDistricts('countries');
			runInAction(() => {
				this.countries = countries.results.map((country) => CountryDomain.countryFromServer(dataFormatters.camelize(country)))
			})
		} catch(e) {
			console.error(e)
		}
	}

	get defaultRegion(){
		return this.regions.find((region) => region.code === this.defaultRegionCode)
	}
}

export default FederalDistrictsStore;