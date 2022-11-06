import API from "../services/api";
import AnalyticsStore from "./analytics";
import FederalDistrictsStore from "./federalDistricts";
import MainDataStore from "./mainData";
import RecommendationsStore from "./recommendation";
import SearchStore from "./search";
import UserStore from "./user";

const baseURL = process.env.REACT_APP_API_URL || '';

class RootStore {
	userStore: UserStore;
	recommendationsStore: RecommendationsStore;
	searchStore: SearchStore;
	federalDistrictsStore: FederalDistrictsStore;
	mainDataStore: MainDataStore;
	analyticsStore: AnalyticsStore;
	backendURL: API;
	constructor(){
		this.backendURL = new API({ baseURL });
		this.userStore = new UserStore(this.backendURL);
		this.recommendationsStore = new RecommendationsStore(this.backendURL);
		this.searchStore = new SearchStore(this.backendURL);
		this.federalDistrictsStore = new FederalDistrictsStore(this.backendURL);
		this.mainDataStore = new MainDataStore(this.backendURL);
		this.analyticsStore = new AnalyticsStore(this.backendURL);
	}
}

type Stores = keyof RootStore

const store = new RootStore();

function useStore(): RootStore;
function useStore<T extends Stores>(storeName: T): RootStore[T];
function useStore<T extends Stores>(storeName?: T)  {
	if(storeName){
		return store[storeName]
	}
	return store
}

export default useStore;