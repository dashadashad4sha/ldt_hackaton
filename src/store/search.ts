import { makeAutoObservable, runInAction } from "mobx";
import TnvedDomain from "../domain/tnved";
import API from "../services/api";
import SearchService from "../services/search";
import { dataFormatters } from "../utils";

type SearchFlags = {
	isSearching: boolean;
	isTouched: boolean;
}

class SearchStore {
	search: TnvedDomain[] = []
	flags: SearchFlags = {
		isSearching: true,
		isTouched: false,
	}
	private searchService: SearchService
	constructor(apiProvider: API){
		makeAutoObservable(this);
		this.searchService = new SearchService(apiProvider);
	}

	async getSuggestions(value: string) {
		runInAction(() => {
			this.flags.isSearching = true;
			this.flags.isTouched = true;
		})
		if(!value){
			runInAction(() => {
				this.search = [];
				this.flags.isTouched = false;
			})
		} else {
			try {
				const code = Number(value);
				const name = isNaN(code) ? value : '';
				const data = await this.searchService.search('customTnved', { name: name, code: code });
				runInAction(() => {
					this.search = data.map((tnved) => new TnvedDomain(dataFormatters.camelize(tnved)));
				})
			} catch (e) {
				console.error('suggestion error', e);
			}
		}
		runInAction(() => {
			this.flags.isSearching = false;
		})
	}

	get suggestions(){
		return this.search.slice(0, 5);
	}

	get hasResults(){
		return this.search.length !== 0
	}
}

export default SearchStore;