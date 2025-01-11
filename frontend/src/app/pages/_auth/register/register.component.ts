import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { I_FormField } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss',
})
export class RegisterComponent {
	formFields: I_FormField[] = [
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: true,
		},
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

	emailAlreadyExists = false;
	somethingElseWrong = false;

	attemptingRegister = false;

	constructor(private authService: AuthService, private router: Router) {}

	async onFormSubmit(formValue: {
		name: string;
		email: string;
		password: string;
	}) {
		try {
			this.attemptingRegister = true;
			await this.authService.register({
				name: formValue.name,
				email: formValue.email,
				password: formValue.password,
			});
			this.router.navigate(['']);
		} catch (e) {
			const error = e as HttpErrorResponse;

			if (error.status == 409) {
				this.emailAlreadyExists = true;
			} else {
				this.somethingElseWrong = true;
			}
		} finally {
			this.attemptingRegister = false;
		}
	}
}
