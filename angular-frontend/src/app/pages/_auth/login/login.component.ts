import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	loginForm: FormGroup;

	attemptingLogin = false;

	tooManyRetries = false;
	wrongPassword = false;
	userNotFound = false;
	somethingElseWrong = false;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]],
		});

		if (true) {
			this.loginForm.patchValue({
				email: '',
				password: '',
			});
		}
	}

	async onSubmit() {
		if (this.loginForm.valid) {
			try {
				this.attemptingLogin = true;

				await this.authService.login({
					email: this.loginForm.value.email,
					password: this.loginForm.value.password,
				});
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
}
