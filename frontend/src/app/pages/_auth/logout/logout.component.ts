import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit, OnDestroy {
	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit() {
		this.logout();
	}

	ngOnDestroy(): void {
		// reload window to reset all services
		window.location.reload();
	}

	async logout() {
		await this.authService.logout();
		this.router.navigate(['/']);
	}
}
