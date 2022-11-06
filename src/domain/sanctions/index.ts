import { makeAutoObservable } from "mobx";
import { CountryId } from "../country";
import { Direction } from "../customData";
import { TnvedCode } from "../tnved";

export type SanctionId = number;

class SanctionsDomain {
	id: SanctionId
	direction: Direction
	country: CountryId
	tnved: TnvedCode
	constructor(sanction: SanctionsDomain){
		makeAutoObservable(this)
		this.id = sanction.id
		this.direction = sanction.direction
		this.country = sanction.country
		this.tnved = sanction.tnved
	}
}

export default SanctionsDomain;