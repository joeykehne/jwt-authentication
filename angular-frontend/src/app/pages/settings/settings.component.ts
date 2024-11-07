import { Component } from '@angular/core';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss',
})
export class SettingsComponent {
	navSections = [
		{
			name: 'User',
			urls: [{ name: 'Profile', routerLink: 'profile' }],
		},
		{
			name: 'Identity & Access',
			urls: [
				{ name: 'Users', routerLink: 'users' },
				{ name: 'Roles', routerLink: 'roles' },
				{ name: 'Permissions', routerLink: 'permissions' },
			],
		},
	];

	constructor() {}
}
