import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	decodedToken: any;

	constructor(private authService: AuthService, private http: HttpClient) {
		this.authService.getAccessToken().subscribe((accessToken) => {
			if (accessToken) {
				this.decodedToken = jwt_decode.jwtDecode(accessToken);
			}
		});
	}

	async logAccessToken() {
		const accessToken = await firstValueFrom(this.authService.getAccessToken());

		console.log(accessToken);
	}

	async register() {
		await this.authService.register({
			email: 'info@kehne-it.de',
			password: 'password',
			roles: ['admin'],
		});
	}

	async login() {
		await this.authService.login({
			email: 'info@kehne-it.de',
			password: 'password',
		});
	}

	async logout() {
		this.authService.logout();
	}

	async getProtected() {
		const response = await firstValueFrom(
			this.http.get(`${environment.apiUrl}/protected`)
		);

		console.log(response);
	}

	async getAdmin() {
		const response = await firstValueFrom(
			this.http.get(`${environment.apiUrl}/admin`)
		);

		console.log(response);
	}
}
