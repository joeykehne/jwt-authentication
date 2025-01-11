import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrl: './logout.component.scss',
})
export class LogoutComponent {
	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit() {
		this.logout();
	}

	async logout() {
		await this.authService.logout();
		this.router.navigate(['/']);
	}
}
