import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface NavItem {
	label: string;
	routerLink: string;
}

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
	appName = 'JWT Authentication';
	navItems: NavItem[] = [
		{
			label: 'Protected',
			routerLink: 'protected',
		},
	];

	constructor(public authService: AuthService, private router: Router) {}

	onNavigate(routerLink: string) {
		this.router.navigate([routerLink]);
		this.closeDropdown();
	}

	onLogout() {
		this.router.navigate(['/logout']);
		this.closeDropdown();
	}

	closeDropdown() {
		const element: any = document.activeElement;
		if (element) {
			element.blur();
		}
	}
}
