import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-verify-email',
	templateUrl: './verify-email.component.html',
	styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
	verifyEmailToken: string = '';
	sendingRequest = false;

	tokenIsInvalid = false;
	emailIsVerified = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient
	) {}

	async ngOnInit() {
		const params = await firstValueFrom(this.route.paramMap);

		this.verifyEmailToken = params.get('token') as string;

		let decodedToken = null;

		try {
			// decode token
			decodedToken = jwtDecode<{ email: string; iat: number; exp: number }>(
				this.verifyEmailToken
			);
		} catch (e) {
			this.tokenIsInvalid = true;
			return;
		}

		// check if token is expired
		const now = Date.now() / 1000;
		if (decodedToken.exp < now) {
			this.tokenIsInvalid = true;
		}

		this.veriifyEmail();
	}

	async veriifyEmail() {
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, 1000);
		});

		await firstValueFrom(
			this.http.get(
				`${environment.apiUrl}/auth/verifyEmail/${this.verifyEmailToken}`,
				{}
			)
		);

		this.emailIsVerified = true;
	}
}
