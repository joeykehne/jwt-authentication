import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { I_FormField } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	formFields: I_FormField[] = [
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			required: true,
			validators: [
				{
					name: 'email',
				},
			],
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			required: true,
		},
	];

	attemptingLogin = false;

	tooManyRetries = false;
	wrongPassword = false;
	userNotFound = false;
	somethingElseWrong = false;

	constructor(private authService: AuthService, private router: Router) {}

	async onFormSubmit(formValue: { email: string; password: string }) {
		try {
			this.attemptingLogin = true;

			await this.authService.login({
				email: formValue.email,
				password: formValue.password,
			});

			this.authService.initializeUser();

			this.router.navigate(['/']);
		} catch (e) {
			const error = e as HttpErrorResponse;

			this.wrongPassword = false;
			this.userNotFound = false;
			this.somethingElseWrong = false;

			if (error.status == 429) {
				this.tooManyRetries = true;
				await setTimeout(() => {
					this.tooManyRetries = false;
				}, 60000);
			} else if (error.status == 401) {
				this.wrongPassword = true;
			} else if (error.status == 404) {
				this.userNotFound = true;
			} else {
				this.somethingElseWrong = true;
			}
		} finally {
			this.attemptingLogin = false;
		}
	}
}
