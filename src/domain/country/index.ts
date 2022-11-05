export type CountryId = number;
export type CountryName = string;
export type CountryBlock = string;

class CountryDomain {
	id: CountryId
	name: CountryName
	block: CountryBlock
	constructor(country: CountryDomain){
		this.id = country.id;
		this.name = country.name;
		this.block = country.block
	}
}

export default CountryDomain;