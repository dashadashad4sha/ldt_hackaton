import { makeAutoObservable } from "mobx";

export type TnvedId = number;
export type TnvedCode = string;
export type TnvedName = string;

class TnvedDomain {
	tnvedId: TnvedId
	tnvedCode: TnvedCode
	tnvedName: TnvedName
	constructor(tnved: TnvedDomain){
		makeAutoObservable(this);
		this.tnvedId = tnved.tnvedId
		this.tnvedCode = tnved.tnvedCode
		this.tnvedName = tnved.tnvedName
	}
}

export default TnvedDomain;