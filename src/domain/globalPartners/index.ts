import { makeAutoObservable } from "mobx";

export type GlobalPartnersCountry = string;
export type GlobalPartnersVolume = string;

export type GlobalPartnersFromServerData = {
	country: GlobalPartnersCountry
	volumeOfTrade: GlobalPartnersVolume
}

class GlobalPartners {
	country:  GlobalPartnersCountry
	volume: GlobalPartnersVolume
	constructor(partner: GlobalPartners){
		makeAutoObservable(this);
		this.country = partner.country
		this.volume = partner.volume
	}

	static globalPartnersFromServer(data: GlobalPartnersFromServerData){
		return new GlobalPartners({
			country: data.country,
			volume: data.volumeOfTrade
		})
	}
}

export default GlobalPartners;