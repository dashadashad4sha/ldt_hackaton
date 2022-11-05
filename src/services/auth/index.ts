import UserDomain, { AccessToken, RefreshToken } from "../../domain/user";
import API from "../api";

const endpoints = {
	tokenCreate: '/employee/token/',
	tokenRefreshCreate: '/employee/token/refresh/',
	tokenVerifyCreate: '/employee/token/verify/',
}

type LoginRequestPayload = {
	username: string;
	password: string;
}

type LoginResponsePayload = {
	access: AccessToken;
	refresh: RefreshToken;
}

type RefreshResponsePayload = LoginResponsePayload;

class AuthService {
	user: UserDomain
	private apiInstance: API

	constructor(user: UserDomain, apiInstance: API) {
		this.user = user;
		this.apiInstance = apiInstance;
		if(this.user.isAuthorized){
			const access = this.user.accessToken as AccessToken
			const refresh = this.user.refreshToken as RefreshToken
			this.updateTokens({ access, refresh })
		}
	}

	private async refreshTokens(){
		try{
			const { data } = await this.apiInstance.post<RefreshResponsePayload>(endpoints.tokenRefreshCreate, {refresh: this.user.refreshToken})
			return data;
		} catch(e){
			throw e;
		}
	}

	private clearTokens() {
		this.user.refreshToken = null;
		this.user.accessToken = null;
		this.apiInstance.setRequestInterceptor((config) => config);
		this.apiInstance.setRequestInterceptor((response) => response, (error) => Promise.reject(error));
	}

	updateTokens({ access, refresh }: RefreshResponsePayload){
		this.user.refreshToken = refresh;
		this.user.accessToken = access;
		this.apiInstance.setRequestInterceptor((config) => {
			config.headers!.Authorization = `Bearer ${access}`;
			return config;
		})
		const interceptorId = this.apiInstance.setResponseInterceptor((response) => response, (error) => {
			if (error.response.status !== 401) {
                return Promise.reject(error);
            }
			this.apiInstance.setResponseEject(interceptorId);

			return this.refreshTokens().then(({ access, refresh }) => {
				this.user.refreshToken = refresh;
				this.user.accessToken = access;
				error.response.config.headers.Authorization = `Bearer ${access}`;
				return this.apiInstance.instance(error.response.config);
			}).catch((error) => {
				this.clearTokens()
				return Promise.reject(error);
			})
		})
	}

	async login(payload: LoginRequestPayload) {
		try{
			const loginRequest = this.apiInstance.post<LoginResponsePayload>(endpoints.tokenCreate, payload);
			const { data } = await loginRequest
			this.updateTokens(data);
		} catch(err: any){
			throw err.response;
		}
	}

	async verifyToken() {
		try {
			await this.apiInstance.post(endpoints.tokenVerifyCreate, { token: this.user.accessToken });
			const access = this.user.accessToken as string;
			const refresh = this.user.refreshToken as string;
			this.updateTokens({ access, refresh });
		} catch(err){
			this.clearTokens();
			throw err;
		} finally {
			this.user.isLoading = false;
		}
	}

	disconnect(){
		this.clearTokens();
	}
}

export default AuthService;