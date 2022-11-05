import { makeAutoObservable } from "mobx";
import UserDomain from "../domain/user";
import API from "../services/api";
import AuthService from "../services/auth";

class UserStore{
	user: UserDomain
	authService: AuthService
	constructor(apiProvider: API){
		makeAutoObservable(this);
		this.user = new UserDomain();
		this.authService = new AuthService(this.user, apiProvider);
	}
}

export default UserStore