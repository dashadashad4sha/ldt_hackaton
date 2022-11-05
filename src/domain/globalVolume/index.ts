import { makeAutoObservable } from "mobx"

export type GlobalVolumePeriod = DateString
export type GlobalVolumeVolume = string

class GlobalVolumeDomain {
	period: GlobalVolumePeriod
	volume: GlobalVolumeVolume
	constructor(globalVolume: GlobalVolumeDomain){
		makeAutoObservable(this);
		this.period = globalVolume.period
		this.volume = globalVolume.volume
	}
}

export default GlobalVolumeDomain;