import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import {
	BehaviorSubject,
	catchError,
	firstValueFrom,
	Observable,
	of,
	shareReplay,
	switchMap,
	tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { I_User } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private accessToken$ = new BehaviorSubject<string | null>(null);
	private tokenRequest$: Observable<string> | null = null;
	public loading$ = new BehaviorSubject<boolean>(false);
	public isLoggedIn$ = this.accessToken$
		.asObservable()
		.pipe(switchMap((accessToken) => of(!!accessToken)));
	public isAdmin$ = this.accessToken$.pipe(
		switchMap((accessToken) => {
			if (!accessToken) {
				return of(false);
			}

			try {
				const decodedToken: any = jwt_decode.jwtDecode(accessToken);
				return of(decodedToken.roles.includes('admin'));
			} catch (e) {
				return of(false);
			}
		})
	);

	constructor(private http: HttpClient, private router: Router) {}

	async getLoggedInUser(): Promise<I_User | null> {
		const accessToken = this.accessToken$.value;
		if (!accessToken) {
			return null;
		}

		try {
			const decodedToken: any = jwt_decode.jwtDecode(accessToken);
			return {
				name: decodedToken.name,
				email: decodedToken.email,
				roles: decodedToken.roles,
			};
		} catch (e) {
			return null;
		}
	}

	async login({ email, password }: { email: string; password: string }) {
		const response = await firstValueFrom(
			this.http.post<{ accessToken: string }>(
				`${environment.apiUrl}/auth/login`,
				{ email, password },
				{
					withCredentials: true,
				}
			)
		);
		this.accessToken$.next(response.accessToken);
	}

	async register(user: I_User) {
		const response = await firstValueFrom(
			this.http.post<{ accessToken: string }>(
				`${environment.apiUrl}/auth/register`,
				user,
				{
					withCredentials: true,
				}
			)
		);

		this.accessToken$.next(response.accessToken);
	}

	async logout() {
		this.accessToken$.next(null);
		await firstValueFrom(
			this.http.get(`${environment.apiUrl}/auth/logout`, {
				withCredentials: true,
			})
		);
	}

	getAccessToken(): Observable<string> {
		// If we already have a valid access token, return it
		const currentToken = this.accessToken$.value;

		if (currentToken && this.isTokenValid(currentToken)) {
			return of(currentToken);
		}

		// If a request is already in progress, return the same observable
		if (this.tokenRequest$) {
			return this.tokenRequest$;
		}

		// Otherwise, try to refresh the access token using the refresh token
		this.loading$.next(true); // Set loading to true
		this.tokenRequest$ = this.refreshAccessToken().pipe(
			tap((newToken) => {
				if (newToken) {
					// If a new token is received, update the accessToken
					this.accessToken$.next(newToken);
				} else {
					// Clear the accessToken if refresh failed
					this.accessToken$.next(null);
				}
				this.tokenRequest$ = null; // Reset after request
				this.loading$.next(false); // Set loading to false
			}),
			shareReplay(1),
			catchError(() => {
				this.tokenRequest$ = null; // Reset on error
				this.loading$.next(false); // Set loading to false
				return of(''); // Return empty string on error
			})
		);

		return this.tokenRequest$;
	}

	forceNewAccessToken(): Observable<string> {
		return this.http
			.get<{ accessToken: string }>(
				`${environment.apiUrl}/auth/getAccessToken`,
				{
					withCredentials: true,
				}
			)
			.pipe(
				switchMap((response) => {
					// Update the access token and return it
					const newToken = response.accessToken;
					this.accessToken$.next(newToken);
					return of(newToken);
				}),
				catchError((error) => {
					console.error('Error refreshing token', error);
					this.accessToken$.next(null); // Clear token on error
					return of(''); // Return an empty string on error
				})
			);
	}

	private refreshAccessToken(): Observable<string> {
		// This makes a request to refresh the access token using the refresh token
		return this.http
			.get<{ accessToken: string }>(
				`${environment.apiUrl}/auth/getAccessToken`,
				{
					withCredentials: true, // Ensure cookies (e.g., refresh token) are sent
				}
			)
			.pipe(
				switchMap((response) => of(response.accessToken)), // Extract the new access token
				catchError(() => of('')) // Return empty string on error
			);
	}

	private isTokenValid(token: string): boolean {
		try {
			const decodedToken: any = jwt_decode.jwtDecode(token);
			const now = Date.now().valueOf() / 1000;
			return decodedToken.exp > now;
		} catch (e) {
			return false;
		}
	}
}
