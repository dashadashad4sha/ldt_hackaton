import { CountryId } from "../country"
import RegionDomain from "../region"
import { TnvedId } from "../tnved"

export type CustomDataDirection = 's' | 'e'
export type CustomDataUnit = number // unit model
export type CustomDataPrice = string
export type CustomDataVolume = string
export type CustomDataQuantity = string

class CustomDataDomain {
	tnved: TnvedId
	direction: CustomDataDirection
	country: CountryId
	period: DateString
	region: RegionDomain
	unit: CustomDataUnit
	price: CustomDataPrice
	volume: CustomDataVolume
	quantity: CustomDataQuantity
	constructor(customData: CustomDataDomain){
		this.tnved = customData.tnved
		this.direction = customData.direction
		this.country = customData.country
		this.period = customData.period
		this.region = customData.region
		this.unit = customData.unit
		this.price = customData.price
		this.volume = customData.volume
		this.quantity = customData.quantity
	}

	get priceAsFloat(){
		return parseFloat(this.price)
	}

	get volumeAsFloat(){
		return parseFloat(this.volume)
	}

	get quantityAsNum(){
		return parseInt(this.quantity)
	}
}

export default CustomDataDomain;