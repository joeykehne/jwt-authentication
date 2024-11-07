import { Component, OnInit } from '@angular/core';
import { I_NavSection } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
	permissions: { [key: string]: boolean } = {
		iam: false,
	};

	allNavSections: I_NavSection[] = [
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

	navSections: I_NavSection[] = [];

	constructor(private authService: AuthService) {}

	async ngOnInit() {
		this.permissions = await this.authService.canAccess(
			Object.keys(this.permissions)
		);

		this.buildNavSections();
	}

	buildNavSections() {
		this.navSections = this.allNavSections.filter((section) => {
			if (section.name === 'User') {
				return true;
			}

			if (section.name === 'Identity & Access') {
				return this.permissions['iam'];
			}

			return false;
		});
	}
}
