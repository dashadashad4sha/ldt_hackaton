import { makeAutoObservable, runInAction } from "mobx";
import CustomDataDomain from "../domain/customData";
import RecommendationsDomain from "../domain/recommendations";
import API from "../services/api";
import SearchService, { SearchEndpointParams } from "../services/search";
import { dataFormatters } from "../utils";

class RecommendationsStore {  
	recommendations: RecommendationsDomain[] = []
	recommendation: CustomDataDomain[] = []
	searchService: SearchService

	flags = {
		isLoading: false,
	}

	constructor(apiProvider: API){
		makeAutoObservable(this);
		this.searchService = new SearchService(apiProvider);
	}

	async getTopRecommendations(params?: SearchEndpointParams['topRecommendation']){
		runInAction(() => {
			this.flags.isLoading = true;
		})
		try {
			const recommendations = await this.searchService.search('topRecommendation', params);
			runInAction(() => {
				this.recommendations = recommendations.map((recommendation) => RecommendationsDomain.recommendationsFromTopServer(dataFormatters.camelize(recommendation)));
			})
		} catch(err){
			console.error(err)
		}
		runInAction(() => {
			this.flags.isLoading = false;
		})
	}

	async getRecommendation(params?: SearchEndpointParams['customData']) {
		try {
			const recommendation = await this.searchService.search('customData', params);
			this.recommendation = recommendation.results;
		} catch(err) {
			console.error(err)
		}
	}
}

export default RecommendationsStore