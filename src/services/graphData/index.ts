import { GlobalPartnersFromServerData } from "../../domain/globalPartners";
import GlobalVolumeDomain from "../../domain/globalVolume";
import API from "../api";

const endpoints = {
	mainExport: '/customs/custom-data/chart/export/',
	mainImport: '/customs/custom-data/chart/import/',
	mainPartners: '/customs/custom-data/chart/main-partner/'
}

type GraphDataEndpointResponse = {
	mainExport: GlobalVolumeDomain[],
	mainImport: GlobalVolumeDomain[],
	mainPartners: GlobalPartnersFromServerData[],
}


class GraphDataService {
	private apiInstance: API
	constructor(apiInstance: API){
		this.apiInstance = apiInstance;
	}
	async getData<T extends keyof typeof endpoints>(endpoint: T){
		try{
			const { data } = await this.apiInstance.get<GraphDataEndpointResponse[T]>(endpoints[endpoint]);
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