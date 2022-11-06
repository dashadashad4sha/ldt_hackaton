import dataFormatters from "../dataFormatters";

const modifyParams = <T extends object>(params: T) => {
	for(let key in params){
		if(key === 'startDate' || key === 'endDate'){
			// @ts-ignore
			params[key] = Math.floor(new Date(params[key]).getTime() / 1000);
		}
	}
	return params;
}


const normalizeParams = <T extends Partial<Record<string, string | number | boolean>>>(params: T) => {
	return Object.fromEntries(Object.entries(params).filter(([, value]) => value).map(([key, value]) => [key, value?.toString()])) as Record<keyof T, string>;
}

const getQueryParams = <T extends object>(params: T | undefined) => {
	if(!params){
		return {}
	}
	return new URLSearchParams(Object.entries(normalizeParams(dataFormatters.snakeize(params))))
}

export default getQueryParams;