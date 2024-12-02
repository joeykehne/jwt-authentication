import { Component } from '@angular/core';
import { I_FormField } from 'src/app/interfaces';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
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

	onFormSubmit(formValue: { email: string }) {
		this.passwordIsReset = true;
		console.log(formValue);
	}
}
