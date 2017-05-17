import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/catch";

import { User } from "../models/user";
import { Product } from "../models/product";
import { Interest } from "../models/interest";
import { AppSettings } from "../app.settings";

@Injectable()
export class UserService
{
	private userSubject: Subject<User>;
	public userState: Observable<User>;

	constructor( private http: Http )
	{
		this.userSubject = new Subject<User>();
		this.userState = this.userSubject.asObservable();
	}

	public getSessionStorageUser(): void
	{
		let userString: string = sessionStorage.getItem( "user" );
		let user: User;
		if( userString )
		{
			let data: any = { data: JSON.parse( userString ) };
			data.token = data.data.token;
			delete data.data.token;
			user = new User( data );
			if( !AppSettings.HEADERS.has( "Authorization" ) )
				AppSettings.HEADERS.set( "Authorization", user.token );
		}
		else
			user = new User( {} );
		this.setUser( user );
	}

	public setUser( user: User, save: boolean = false ): void
	{
		if( user.token && save )
			sessionStorage.setItem( "user", JSON.stringify( user ) );
		this.userSubject.next( <User>user );
	}

	public logOut(): void
	{
		sessionStorage.removeItem( "user" );
		this.setUser( new User( {} ) );
	}

	// Handle errors
	private handleError( error: any ): Promise<any>
	{
		console.error( "An error occurred", error );
		return Promise.reject( error.message || error );
	}

	public logIn( credentials: any ): Promise<any>
	{
		return this.http.post( `${AppSettings.API_ENDPOINT}/login`, credentials, { headers: AppSettings.HEADERS } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	public get( id: number ): Promise<any>
	{
		return this.http.get( `${AppSettings.API_ENDPOINT}/users/${id}` ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	public create( user: User, password: string ): Promise<any>
	{
		let userAux: any = Object.assign( {}, user );
		userAux.interests = user.interests.map( ( interest: Interest ) => interest.id );
		userAux.password = password;
		userAux.last_name = user.lastName;
		delete userAux.lastName;
		delete userAux.id;
		delete userAux.token;
		delete userAux.city;
		return this.http.post( `${AppSettings.API_ENDPOINT}/users`, { data: userAux }, { headers: AppSettings.HEADERS } ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}

	public update( user: User ): Promise<any>
	{
		let userAux: any = Object.assign( {}, user );
		userAux.interests = user.interests.map( ( interest: Interest ) => interest.id );
		userAux.last_name = user.lastName;
		delete userAux.lastName;
		delete userAux.id;
		delete userAux.token;
		delete userAux.city;
		return this.http.put( `${AppSettings.API_ENDPOINT}/users/${user.id}`, { data: userAux }, { headers: AppSettings.HEADERS } ).toPromise()
			.then( response => response.json().data )
			.catch( this.handleError );
	}

	public delete( id: number ): Promise<any>
	{
		return this.http.delete( `${AppSettings.API_ENDPOINT}/users/${id}` ).toPromise()
			.then( response => response.json().data )
			.catch( this.handleError );
	}

	public existsWithEmail( email: string ): Promise<any>
	{
		return this.http.get( `${AppSettings.API_ENDPOINT}/users/validate?email=${email}` ).toPromise()
			.then( response => response.json() )
			.catch( this.handleError );
	}
	
	public getNear( dist: number ): Observable<User[]>{
		let url: string = `${AppSettings.API_ENDPOINT}/users/near`;
		if(dist>1){
			url += "?dist="+String(dist);
		}
		return this.http.get( url,  { headers: AppSettings.HEADERS } )
			.map( response => response.json().data || { } )
			.catch( this.handleError );
	}
	
	public getAllProductsForUser( id: number ): Observable<Product[]>{
		return this.http.get( `${AppSettings.API_ENDPOINT}/users/products?id=${id}`,  { headers: AppSettings.HEADERS } )
			.map( response => response.json().results || { } )
			.catch( this.handleError );
	}
}