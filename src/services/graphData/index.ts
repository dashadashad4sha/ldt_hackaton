import { CountryName } from "../../domain";
import { GlobalPartnersFromServerData } from "../../domain/globalPartners";
import GlobalVolumeDomain from "../../domain/globalVolume";
import SanctionsDomain from "../../domain/sanctions";
import { getQueryParams } from "../../utils";
import API from "../api";

const endpoints = {
	mainExport: '/customs/custom-data/chart/export/',
	mainImport: '/customs/custom-data/chart/import/',
	mainPartners: '/customs/custom-data/chart/main-partner/',
	analyticsTradePartners: '/customs/tnved/chart/customs-partner/',
	analyticsImportExport: '/customs/tnved/chart/customs-volume/',
	analyticsClearImport: '/customs/tnved/clera-import/',
	analyticsSanctions: '/customs/sanction/goods-volume/',
}

export type AnalyticsTradePartners = {
	country: CountryName,
	importVolume: string,
	exportVolume: string,
	tradeVolume: string,
}

export type AnalyticsImportExport = {
	date: DateString,
	importValue: string,
	exportValue: string,
}

export type AnalyticsClearImport = {
	date: DateString,
	importVolume: string,
}

export type AnalyticsSanctions = {
	code: string,
	sanctionSum: string,
	nonSanctionSum: string
}

type GraphDataEndpointResponse = {
	mainExport: GlobalVolumeDomain[],
	mainImport: GlobalVolumeDomain[],
	mainPartners: GlobalPartnersFromServerData[],
	analyticsTradePartners: AnalyticsTradePartners[],
	analyticsImportExport: AnalyticsImportExport[],
	analyticsSanctions: AnalyticsSanctions[],
	analyticsClearImport: AnalyticsClearImport[],
}

type DefaultFilters = {
	startDate: DateString,
	endDate: DateString,
	code: string,
	region: string,
}

type GraphDataEndpointParams = {
	mainExport: {},
	mainImport: {},
	mainPartners: {},
	analyticsTradePartners: DefaultFilters,
	analyticsImportExport: DefaultFilters,
	analyticsSanctions: Omit<DefaultFilters, 'startDate' | 'endDate'>,
	analyticsClearImport: DefaultFilters,
}
class GraphDataService {
	private apiInstance: API
	constructor(apiInstance: API){
		this.apiInstance = apiInstance;
	}
	async getData<T extends keyof typeof endpoints>(endpoint: T, params?: GraphDataEndpointParams[T]){
		try{
			const queryParams = getQueryParams(params);
			const { data } = await this.apiInstance.get<GraphDataEndpointResponse[T]>(endpoints[endpoint], { params: queryParams });
			return data;
		} catch(e){
			throw e
		}
	}
	async getMainData(){
		try{
			const exportPromise = this.getData('mainExport');
			const importPromise = this.getData('mainImport');
			const partnersPromise = this.getData('mainPartners');
			const results = await Promise.allSettled([exportPromise, importPromise, partnersPromise]);
			const filteredResult = {
				export: { success: results[0].status === 'fulfilled', data: results[0] as PromiseFulfilledResult<GlobalVolumeDomain[]>  },
				import: { success: results[1].status === 'fulfilled', data: results[1] as PromiseFulfilledResult<GlobalVolumeDomain[]>  },
				partners: { success: results[2].status === 'fulfilled', data: results[2] as PromiseFulfilledResult<GlobalPartnersFromServerData[]>  },
			}
			return filteredResult
		} catch (e){
			throw e
		}
	}
}

export default GraphDataService;