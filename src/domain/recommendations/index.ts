import { makeAutoObservable } from "mobx";

export type RecommendationsTnvedCode = string;
export type RecommendationsTnvedName = string;

export type RecommendationsFromTopServer = {
	tnvedTnvedCode: string;
	tnvedTnvedName: string;
}

class RecommendationsDomain {
	tnvedCode: RecommendationsTnvedCode
	tnvedName: RecommendationsTnvedName
	constructor(recommendations: RecommendationsDomain){
		makeAutoObservable(this);
		this.tnvedCode = recommendations.tnvedCode
		this.tnvedName = recommendations.tnvedName
	}
	static recommendationsFromTopServer(data: RecommendationsFromTopServer){
		return new RecommendationsDomain({
			tnvedCode: data.tnvedTnvedCode,
			tnvedName: data.tnvedTnvedName
		})
	}
}

export default RecommendationsDomain;