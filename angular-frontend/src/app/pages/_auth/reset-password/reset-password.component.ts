import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { I_FormField } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrl: './reset-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
	formFields: I_FormField[] = [
		{
			name: 'password',
			label: 'New password',
			type: 'password',
			required: true,
			validators: [
				{
					name: 'password',
				},
			],
		},
		{
			name: 'confirmPassword',
			label: 'Confirm password',
			type: 'password',
			required: true,
			validators: [
				{
					name: 'confirmPassword',
				},
			],
		},
	];

	passwordIsReset = false;
	tokenIsInvalid = false;

	sendingRequest = false;

	resetToken: string = '';
	decodedToken: { email: string; iat: number; exp: number } | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient
	) {}

	async ngOnInit() {
		const params = await firstValueFrom(this.route.paramMap);

		this.resetToken = params.get('token') as string;

		if (!this.resetToken) {
			this.router.navigate(['/login']);
		}

		let decodedToken = null;

		try {
			// decode token
			decodedToken = jwtDecode<{ email: string; iat: number; exp: number }>(
				this.resetToken
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

		this.decodedToken = decodedToken;
	}

	async onFormSubmit(formValue: { password: string }) {
		this.sendingRequest = true;

		await firstValueFrom(
			this.http.post(`${environment.apiUrl}/auth/changePassword`, {
				token: this.resetToken,
				password: formValue.password,
			})
		);

		this.sendingRequest = false;
		this.passwordIsReset = true;
	}
}
