import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";

type APIInstance = AxiosInstance

class API {
	instance: APIInstance;
	constructor(config: CreateAxiosDefaults){
		this.instance = axios.create(config)
	}
	setRequestInterceptor(success?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>, error?: (err: any) => any){
		return this.instance.interceptors.request.use(success, error)
	}
	setResponseInterceptor(success?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>, error?: (err: any) => any){
		return this.instance.interceptors.response.use(success, error)
	}
	setResponseEject(id: number) {
		this.instance.interceptors.response.eject(id);
	}
	get<T = any>(url: string, config?: AxiosRequestConfig){
		return this.instance.get<T>(url, config)
	}
	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig){
		return this.instance.post<T>(url, data, config);
	}
}

export default API;