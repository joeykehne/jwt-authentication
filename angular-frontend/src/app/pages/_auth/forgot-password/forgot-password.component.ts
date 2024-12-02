import { Component } from '@angular/core';
import { I_FormField } from 'src/app/interfaces';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
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
	];

	emailSent = false;

	onFormSubmit(formValue: { email: string }) {
		this.emailSent = true;
		console.log(formValue);
	}
}
