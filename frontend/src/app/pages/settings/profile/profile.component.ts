import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ChangePasswordDialogComponent } from 'src/app/dialog/change-password-dialog/change-password-dialog.component';
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
	userLoading = true;
	verificationMailSend = false;

	constructor(
		public authService: AuthService,
		private http: HttpClient,
		private toastService: ToastService,
		private dialog: MatDialog
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
			this.authService.imagePreview$.next(
				`${environment.apiUrl}/users/profilePicture/${user.id}`
			);
		} else {
			this.authService.imagePreview$.next(
				'assets/images/profile-picture-placeholder.jpg'
			);
		}

		this.authService.user$.next(user);
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

		this.verificationMailSend = true;

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

			this.authService.imagePreview$.next(URL.createObjectURL(file));
		} catch (e: any) {
			this.toastService.addToast({
				message: e.error.message,
				type: 'error',
			});
		}
	}

	async onChanegPasswordClicked() {
		const dialogRef = this.dialog.open(ChangePasswordDialogComponent);

		await firstValueFrom(dialogRef.afterClosed());
	}
}
