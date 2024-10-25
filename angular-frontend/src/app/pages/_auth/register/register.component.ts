import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmPasswordValidator } from 'src/app/validators/confirmPassword.validator';
import { PasswordValidator } from 'src/app/validators/password.validator';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss',
})
export class RegisterComponent {
	registerForm: FormGroup;

	emailAlreadyExists = false;
	somethingElseWrong = false;

	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		private authService: AuthService,
		private router: Router
	) {
		this.registerForm = this.fb.group(
			{
				name: ['', Validators.required],
				email: ['', [Validators.required, Validators.email]],
				password: [
					'',
					[
						Validators.required,
						Validators.minLength(6),
						PasswordValidator.strong,
					],
				],
				confirmPassword: ['', [Validators.required]],
			},
			{ validators: ConfirmPasswordValidator.mismatch }
		);

		if (false) {
			this.registerForm.patchValue({
				email: 'email@email.com',
				password: 'Changeme123',
				confirmPassword: 'Changeme123',
				name: 'User',
			});
		}
	}

	async onSubmit() {
		if (this.registerForm.valid) {
			try {
				await this.authService.register({
					name: this.registerForm.value.name,
					email: this.registerForm.value.email,
					password: this.registerForm.value.password,
				});
				this.router.navigate(['']);
			} catch (e) {
				const error = e as HttpErrorResponse;

				if (error.status == 409) {
					this.emailAlreadyExists = true;
				} else {
					this.somethingElseWrong = true;
				}
			}
		}
	}
}
