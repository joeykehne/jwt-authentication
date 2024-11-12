import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent {
	constructor(public authService: AuthService, private clipboard: Clipboard) {}

	copyToken() {
		this.authService.getAccessToken().subscribe((token) => {
			if (token) {
				this.clipboard.copy(token);
			}
		});
	}
}
