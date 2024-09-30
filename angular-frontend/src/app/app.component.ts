import { Component } from '@angular/core';
import { HttpService } from './services/http.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor(private http: HttpService) {}

	// Logs the current access token to the console
	async logAccessToken() {
		console.log(this.http.accessToken);
	}

	// Fetches and logs data from a protected endpoint
	async getProtected() {
		try {
			const protectedData = await this.http.get('protected');
			console.log(protectedData);
		} catch (error) {
			console.error('Error fetching protected data:', error);
		}
	}

	// Requests a new access token and logs it
	async requestNewAccessToken() {
		try {
			await this.http.requestNewAccessToken();
			console.log(this.http.accessToken);
		} catch (error) {
			console.error('Error requesting new access token:', error);
		}
	}

	// Registers a new user and logs the user and access token
	async register() {
		try {
			const { accessToken } = await this.http.post<{
				user: any;
				accessToken: string;
			}>(
				'auth/register',
				{
					email: 'email@email.com',
					password: 'changeme',
					name: 'User',
				},
				true
			);
			this.http.accessToken = accessToken;
			console.log(accessToken);
		} catch (error) {
			console.error('Error registering user:', error);
		}
	}

	// Logs in an existing user and logs the user and access token
	async login() {
		try {
			const { accessToken } = await this.http.post<{
				user: any;
				accessToken: string;
			}>(
				'auth/login',
				{
					email: 'email@email.com',
					password: 'changeme',
				},
				true
			);
			this.http.accessToken = accessToken;
			console.log(accessToken);
		} catch (error) {
			console.error('Error logging in:', error);
		}
	}

	// Logs out the current user and clears the access token
	async logout() {
		try {
			await this.http.get('auth/logout', true);
			this.http.accessToken = '';
			console.log('Logged out');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	}
}
