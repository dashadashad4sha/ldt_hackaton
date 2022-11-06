import { TnvedId } from "../../domain";
import TnvedDomain from "../../domain/tnved";
import API from "../api";

const endpoints = {
	analyticsOneTwoSix: '/customs/analytic/one_two_six/',
	analyticsThree: '/customs/analytic/three/',
	analyticsFour: '/customs/analytic/four/',
	analyticsFive: '/customs/analytic/five/',
	analyticsSeven: '/customs/analytic/seven/',
}

type AnalyticsEndpointsResponse = {
	analyticsOneTwoSix: { one: string, two: string, six: string },
	analyticsThree: { value: number },
	analyticsFour: { value: number },
	analyticsFive: { value: string },
	analyticsSeven: { value: string[] },
}

class AnalyticsService {
	private apiInstance: API
	constructor(apiInstance: API){
		this.apiInstance = apiInstance;
	}
	async getAnalyticPart<T extends keyof typeof endpoints>(endpoint: T) {
		try {
			const { data } = await this.apiInstance.get<AnalyticsEndpointsResponse[T]>(endpoints[endpoint]);
			return data
		} catch(e){
			throw e
		}
	}
	async getAllData(){
		const oneTwoSixPromise = await this.getAnalyticPart('analyticsOneTwoSix');
		const threePromise = await this.getAnalyticPart('analyticsThree');
		const fourPromise = await this.getAnalyticPart('analyticsFour');
		const fivePromise = await this.getAnalyticPart('analyticsFive');
		const sevenPromise = await this.getAnalyticPart('analyticsSeven');
		try {
			const analytics = await Promise.all([oneTwoSixPromise, threePromise, fourPromise, fivePromise, sevenPromise]);
			return analytics;
		} catch (e){
			throw e
		}
	}
	async getTnvedData(id: TnvedId) {
		try {
			const { data } = await this.apiInstance.get<TnvedDomain>(`/customs/tnved/${id}/`);
			return data;
		} catch(e) {
			throw e
		}
	}
}

export default AnalyticsService;