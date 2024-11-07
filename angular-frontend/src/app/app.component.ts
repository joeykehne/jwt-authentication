import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(
		public toastService: ToastService,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.authService.getAccessToken().subscribe();
	}
}
