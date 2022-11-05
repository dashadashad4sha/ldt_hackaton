import { makeAutoObservable, runInAction } from "mobx"
import GlobalPartners from "../domain/globalPartners";
import GlobalVolumeDomain from "../domain/globalVolume";
import API from "../services/api";
import GraphDataService from "../services/graphData";
import { dataFormatters } from "../utils";

export type GraphModel<T> = {
	status: boolean,
	data: T[],
}

class MainDataStore{
	exportVolume: GraphModel<GlobalVolumeDomain> = {
		status: true,
		data: [],
	}
	importVolume: GraphModel<GlobalVolumeDomain> = {
		status: true,
		data: [],
	}
	partners: GraphModel<GlobalPartners> = {
		status: true,
		data: [],
	}

	flags = {
		isLoading: false
	}

	graphDataService: GraphDataService

	constructor(apiInstance: API){
		makeAutoObservable(this);
		this.graphDataService = new GraphDataService(apiInstance);
	}

	async getMainData(){
		runInAction(() => {
			this.flags.isLoading = true
		})
		try {
			const results = await this.graphDataService.getMainData();
			runInAction(() => {
				this.exportVolume = {
					status: results.export.success,
					data: results.export.data?.value.map((val) => new GlobalVolumeDomain(val)) || []
				}
				this.importVolume = {
					status: results.import.success,
					data: results.import.data?.value.map((val) => new GlobalVolumeDomain(val)) || []
				}
				this.partners = {
					status: results.partners.success,
					data: results.partners.data?.value.map((val) => GlobalPartners.globalPartnersFromServer(dataFormatters.camelize(val))) || []
				}
			})
		} catch(e){
			console.error(e);
		}
		runInAction(() => {
			this.flags.isLoading = false
		})
	}
}

export default MainDataStore;