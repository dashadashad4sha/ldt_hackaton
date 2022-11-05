import CustomDataDomain from "../../domain/customData";
import RecommendationsDomain, { RecommendationsFromTopServer } from "../../domain/recommendations";
import TnvedDomain from "../../domain/tnved";
import UserDomain from "../../domain/user";
import { dataFormatters } from "../../utils";
import API from "../api";

const searchEndpoints = {
	customData: '/customs/custom-data/',
	recommendation: '/customs/recommendation/',
	customTnved: '/customs/tnved/',
	topRecommendation: '/customs/recommendation/top/',
}

export type SearchEndpointParams = {
	customData: Record<keyof Omit<UserDomain, 'period'> & 'start' | 'end', string | number | boolean>
	recommendation: { topCount: string }
	customTnved: { code?: number, name?: string }
	topRecommendation: { region: string }
}

type SearchEndpointResponse = {
	customData: PaginatedResponse<CustomDataDomain>
	recommendation: PaginatedResponse<RecommendationsDomain>
	customTnved: TnvedDomain[]
	topRecommendation: RecommendationsFromTopServer[]
}

const normalizeParams = <T extends Partial<Record<string, string | number | boolean>>>(params?: T) => {
	if(!params){
		return {}
	}
	return Object.fromEntries(Object.entries(params).filter(([, value]) => value).map(([key, value]) => [key, value?.toString()])) as Record<keyof T, string>;
}

class SearchService {
	private apiInstance: API
	constructor(apiInstance: API){
		this.apiInstance = apiInstance;
	}
	async search<T extends keyof typeof searchEndpoints>(endPoint: T, params?: Partial<SearchEndpointParams[T]>){
		const queryParams = new URLSearchParams(Object.entries(normalizeParams(dataFormatters.snakeize(params))));
		try{
			const { data } = await this.apiInstance.get<SearchEndpointResponse[T]>(searchEndpoints[endPoint], { params: queryParams });
			return data;
		} catch(err) {
			throw err;
		}
	}
}

export default SearchService;