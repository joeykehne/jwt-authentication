import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class HttpService {
	private _accessToken: string = '';

	constructor(private http: HttpClient) {}

	// Generates HTTP headers with the current access token
	private getHeaders(): HttpHeaders {
		return new HttpHeaders({
			Authorization: `Bearer ${this._accessToken}`,
			'Content-Type': 'application/json',
		});
	}

	// Setter for access token
	set accessToken(accessToken: string) {
		this._accessToken = accessToken;
	}

	// Getter for access token
	get accessToken(): string {
		return this._accessToken;
	}

	// Makes a GET request with the given path and returns a promise of the response
	private async makeGetRequest<T>(
		path: string,
		withCredentials = false
	): Promise<T> {
		return firstValueFrom(
			this.http.get<T>(`${environment.apiUrl}/${path}`, {
				headers: this.getHeaders(),
				withCredentials,
			})
		);
	}

	// Public method to make a GET request, tries to refresh token if the request fails
	async get<T>(path: string, withCredentials = false): Promise<T> {
		try {
			return await this.makeGetRequest<T>(path, withCredentials);
		} catch (error) {
			// Attempt to refresh the access token if the request fails
			const freshAccessToken = await this.requestNewAccessToken();
			if (!freshAccessToken) {
				// TODO: Handle the case where a new access token could not be retrieved
				// For example, redirect to the login page
				// this.router.navigate(['/login']);
				return {} as T;
			}
			return await this.makeGetRequest<T>(path, withCredentials);
		}
	}

	// Makes a POST request with the given path and data, returns a promise of the response
	private async makePostRequest<T>(
		path: string,
		data: object,
		withCredentials = false
	): Promise<T> {
		return firstValueFrom(
			this.http.post<T>(`${environment.apiUrl}/${path}`, data, {
				headers: this.getHeaders(),
				withCredentials,
			})
		);
	}

	// Public method to make a POST request, tries to refresh token if the request fails
	async post<T>(
		path: string,
		data: object,
		withCredentials = false
	): Promise<T> {
		try {
			return await this.makePostRequest<T>(path, data, withCredentials);
		} catch (error) {
			// Attempt to refresh the access token if the request fails
			const freshAccessToken = await this.requestNewAccessToken();
			if (!freshAccessToken) {
				// TODO: Handle the case where a new access token could not be retrieved
				// For example, redirect to the login page
				// this.router.navigate(['/login']);
				return {} as T;
			}
			return await this.makePostRequest<T>(path, data);
		}
	}

	// Requests a new access token from the server
	async requestNewAccessToken(): Promise<string | null> {
		try {
			const response = await firstValueFrom(
				this.http.get<{ accessToken: string }>(
					`${environment.apiUrl}/auth/getAccessToken`,
					{
						withCredentials: true,
					}
				)
			);
			this.accessToken = response.accessToken; // Update the access token
			return this.accessToken;
		} catch (error) {
			console.error('Failed to refresh access token');
			return null; // Return null if token refresh fails
		}
	}
}
