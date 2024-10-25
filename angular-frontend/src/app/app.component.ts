import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor(
		public authService: AuthService,
		public toastService: ToastService
	) {}

	ngOnInit() {
		this.authService.getAccessToken();
	}
}
