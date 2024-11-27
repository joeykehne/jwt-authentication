import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { I_FormField } from 'src/app/interfaces';
import { ConfirmPasswordValidator } from 'src/app/validators/confirmPassword.validator';
import { PasswordValidator } from 'src/app/validators/password.validator';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	formFields: I_FormField[] = [
		{
			name: 'username',
			label: 'Username',
			type: 'text',
			value: '',
			required: true,
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			value: '',
			required: true,
			validators: [{
				name: 'strong',
				message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
				value: true,
			}],
		},
		{
			name: 'confirmPassword',
			label: 'Confirm password',
			type: 'password',
			value: '',
			required: true,
			validators: [{
				name: 'mismatch',
				message: 'Passwords do not match.',
				value: true,
			}],
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			value: '',
			required: true,
			validators: [{
				name: 'pattern',
				message: 'Please enter a valid email address.',
				value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			}],
		},
		{
			name: 'age',
			label: 'Age',
			type: 'number',
			value: '',
			required: false,
		},
		{
			name: 'bio',
			label: 'Bio',
			type: 'textarea',
			value: '',
			required: false,
		},
		{
			name: 'role',
			label: 'Role',
			type: 'select',
			value: '',
			required: true,
			selectOptions: [
				{ key: 'admin', value: 'Admin' },
				{ key: 'user', value: 'User' },
			],
		},
	];

	onFormSubmit(data: any) {
		console.log(data);
	}
}
