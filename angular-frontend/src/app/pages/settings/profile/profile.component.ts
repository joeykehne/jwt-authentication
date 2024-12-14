import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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
	user$ = new BehaviorSubject<I_User | null>(null);
	imagePreview$ = new BehaviorSubject<string | null>(null);
	userLoading = true;

	constructor(
		public authService: AuthService,
		private http: HttpClient,
		private toastService: ToastService
	) {}

	async ngOnInit() {
		await this.loadUser();
		this.userLoading = false;
	}

	async loadUser() {
		const user = await firstValueFrom(
			this.http.get<I_User>(`${environment.apiUrl}/users/me`)
		);

		if (user.profilePictureUrl) {
			this.imagePreview$.next(
				`${environment.apiUrl}/users/profilePicture/${user.id}`
			);
		}

		this.user$.next(user);

		console.log(user);
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
							'You already requested a verification email. Please wait 10 minutes before trying again',
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

	async profilePictureSelected(file: File) {
		const formData = new FormData();
		formData.append('profilePicture', file);

		try {
			await firstValueFrom(
				this.http.post(`${environment.apiUrl}/users/profilePicture`, formData)
			);

			this.imagePreview$.next(URL.createObjectURL(file));
		} catch (e: any) {
			this.toastService.addToast({
				message: e.error.message,
				type: 'error',
			});
		}
	}
}
