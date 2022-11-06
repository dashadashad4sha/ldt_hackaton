import { makeAutoObservable } from "mobx";

export type CountryId = number;
export type CountryName = string;
export type CountryBlock = string;

export type CountryFromServer = {
	countryId: CountryId,
	countryName: CountryName,
	countryBlock: CountryBlock,
}
class CountryDomain {
	id: CountryId
	name: CountryName
	block: CountryBlock
	constructor(country: CountryDomain){
		makeAutoObservable(this);
		this.id = country.id;
		this.name = country.name;
		this.block = country.block
	}

	static countryFromServer(country: CountryFromServer){
		return new CountryDomain({
			id: country.countryId,
			name: country.countryName,
			block: country.countryBlock
		})
	}
}

export default CountryDomain;