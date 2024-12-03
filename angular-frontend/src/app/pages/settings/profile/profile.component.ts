import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { I_User } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent {
	user: I_User | null = null;

	constructor(
		public authService: AuthService,
		private http: HttpClient,
		private toastService: ToastService
	) {}

	ngOnInit(): void {
		this.loadUser();
	}

	async loadUser() {
		const user = await firstValueFrom(
			this.http.get<I_User>(`${environment.apiUrl}/users/me`)
		);

		this.user = user;
	}

	async requestEmailVerification() {
		try {
			await firstValueFrom(
				this.http.post(
					`${environment.apiUrl}/auth/requestEmailVerification`,
					{}
				)
			);
		} catch (e: any) {
			switch (e.status) {
				case 429:
					this.toastService.addToast({
						message:
							'You already requested a verification email. PLease wait 10 minutes before trying again',
						type: 'error',
					});
					break;
				case 400:
					this.toastService.addToast({
						message: 'Your email is already verified',
						type: 'error',
					});
					break;
				default:
					break;
			}
			return;
		}

		this.toastService.addToast({
			message: 'Verification email sent',
			type: 'success',
		});
	}
}
