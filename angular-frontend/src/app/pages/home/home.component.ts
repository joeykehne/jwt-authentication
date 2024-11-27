import { Component } from '@angular/core';
import { I_FormField } from 'src/app/interfaces';

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
			required: false,
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			value: '',
			required: true,
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
