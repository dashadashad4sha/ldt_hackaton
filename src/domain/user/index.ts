import { makeAutoObservable } from "mobx";

export type RefreshToken = string;
export type AccessToken = string;

export type UserAuthorizationToken = {
	refresh: Nullable<RefreshToken>
	access: Nullable<AccessToken>
}

export type UserFlags = {
	isLoading: boolean;
}

export type UserAuthorization = {
	tokens: UserAuthorizationToken
}

class UserDomain {
	private authorization: UserAuthorization = {
		tokens: {
			refresh: null,
			access: null,
		}
	};

	private flags: UserFlags = {
		isLoading: true
	}

	constructor() {
		makeAutoObservable(this);
		this.getTokensFromLS()
	}
	private getTokensFromLS(){
		if(localStorage){
			this.authorization.tokens.refresh = localStorage.getItem('refresh');
			this.authorization.tokens.access = localStorage.getItem('access');
			return;
		}	
		console.warn('Local storage does not exist')
	}
	get isAuthorized(){
		return this.authorization.tokens.access && !this.isLoading
	}

	get isLoading(){
		return this.flags.isLoading
	}

	set isLoading(status: boolean){
		this.flags.isLoading = status
	}

	get refreshToken(){
		return this.authorization.tokens.access
	}
	get accessToken(){
		return this.authorization.tokens.access
	}

	set refreshToken(token: Nullable<RefreshToken>){
		this.authorization.tokens.refresh = token
		if(token) 
			{ localStorage.setItem('refresh', token) }
		else {
			localStorage.removeItem('refresh');
		}
	}
	set accessToken(token: Nullable<AccessToken>){
		this.authorization.tokens.access = token
		if(token)
			{ localStorage.setItem('access', token) }
		else {
			localStorage.removeItem('access');
		}
	}
}

export default UserDomain;