import { makeAutoObservable, runInAction } from "mobx";
import TnvedDomain from "../domain/tnved";
import UserDomain from "../domain/user";
import API from "../services/api";
import AuthService from "../services/auth";
import { dataFormatters } from "../utils";

class UserStore{
	user: UserDomain
	authService: AuthService
	favorite: TnvedDomain[] = []
	constructor(private apiProvider: API){
		makeAutoObservable(this);
		this.user = new UserDomain();
		this.authService = new AuthService(this.user, apiProvider);
	}

	async getFavorite(){
		if(!localStorage){
			return
		}
		const liked = JSON.parse(localStorage.getItem('favorite') || '[]');
		try {
			const likedFromServer = await Promise.all(liked.map((likeId: string) => this.apiProvider.get<TnvedDomain>(`/customs/tnved/${likeId}/`)));
			runInAction(() => {
				this.favorite = likedFromServer.map((obj) => new TnvedDomain(dataFormatters.camelize(obj.data)));
			})
		} catch(e){
			console.error(e);
		}
	}

	async addToFavorite(tnved: TnvedDomain['tnvedId']){
		if(!localStorage){
			return;
		}
		if(this.isFavorite(tnved)){
			return;
		}
		try {
			const liked = JSON.parse(localStorage.getItem('favorite') || '[]');
			localStorage.setItem('favorite', JSON.stringify([...liked, tnved]));
			const { data } = await this.apiProvider.get<TnvedDomain>(`/customs/tnved/${tnved}/`);
			runInAction(() => {
				this.favorite.push(new TnvedDomain(dataFormatters.camelize(data)));
			})
		} catch(err){
			console.error(err);
		}
		
	}

	removeFromFavorite(tnved: TnvedDomain['tnvedId']) {
		if(!localStorage){
			return
		}
		const newLiked = this.favorite.filter((obj) => obj.tnvedId !== tnved);
		localStorage.setItem('favorite', JSON.stringify(newLiked));
		runInAction(() => {
			this.favorite = newLiked;
		})
	}

	isFavorite(tnved: TnvedDomain['tnvedId']){
		return this.favorite.findIndex((obj) => obj.tnvedId === tnved) !== -1;
	}
}

export default UserStore