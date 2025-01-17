import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';
import { I_User } from 'src/app/generated_interfaces';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
import { UpdateUserDialogComponent } from './update-user-dialog/update-user-dialog.component';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
	users: I_User[] = [];
	loading = true;

	constructor(
		private http: HttpClient,
		private dialog: MatDialog,
		private toast: ToastService
	) {}

	async ngOnInit() {
		await this.reloadUsers();
	}

	async reloadUsers() {
		try {
			this.users = await firstValueFrom(
				this.http.get<I_User[]>(`${environment.apiUrl}/users`)
			);
		} catch (e: any) {
			if (e.status === 403) {
				this.toast.addToast({
					type: 'error',
					message: 'You do not have permission to view users.',
				});
				return;
			}
			this.toast.addToast({
				type: 'error',
				message: 'Failed to load users',
			});
		} finally {
			this.loading = false;
		}
	}

	async onUpdateUser(user: I_User) {
		const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
			data: user,
		});

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (response) {
			const index = this.users?.findIndex((user) => user.id === response.id);
			this.users[index] = response;
		}
	}

	async onLogoutUser(user: I_User) {
		const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Logout User',
				description: `Are you sure you want to logout "${user.email}" from all devices?`,
			},
		});

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (!response) {
			return;
		}

		try {
			await firstValueFrom(
				this.http.patch(
					`${environment.apiUrl}/auth/logoutUserEverywhere/${user.id}`,
					{}
				)
			);

			this.toast.addToast({
				message: `${user.email} has been logged out from all devices`,
				type: 'success',
			});
		} catch (error) {
			this.toast.addToast({
				message: 'An error occurred. Please try again',
				type: 'error',
			});
		}
	}
}
