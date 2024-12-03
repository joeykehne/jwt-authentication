import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { I_FormField } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

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
	emailSentTo = '';

	sendingEmail = false;

	constructor(private http: HttpClient) {}

	async onFormSubmit(formValue: { email: string }) {
		this.sendingEmail = true;

		await firstValueFrom(
			this.http.post(`${environment.apiUrl}/auth/forgotPassword`, formValue)
		);
		this.emailSent = true;
		this.emailSentTo = formValue.email;
		this.sendingEmail = false;
	}
}
