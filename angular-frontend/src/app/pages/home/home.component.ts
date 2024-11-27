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
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			value: '',
		},
	];

	onFormSubmit(event: any) {
		console.log(event);
	}
}
