import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';
import { I_Permission } from 'src/app/generated_interfaces';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
import { AddPermissionDialogComponent } from './add-permission-dialog/add-permission-dialog.component';
import { UpdatePermissionDialogComponent } from './update-permission-dialog/update-permission-dialog.component';

@Component({
	selector: 'app-permissions',
	templateUrl: './permissions.component.html',
	styleUrl: './permissions.component.scss',
})
export class PermissionsComponent {
	permissions: I_Permission[] = [];
	loading = true;

	constructor(
		private http: HttpClient,
		private dialog: MatDialog,
		private toastService: ToastService
	) {}

	async ngOnInit() {
		await this.reloadPermissions();
	}

	async reloadPermissions() {
		try {
			this.permissions = await firstValueFrom(
				this.http.get<I_Permission[]>(`${environment.apiUrl}/permissions`)
			);
		} catch (e: any) {
			if (e.status === 403) {
				this.toastService.addToast({
					type: 'error',
					message: 'You do not have permission to view permissions.',
				});
				return;
			}
			this.toastService.addToast({
				type: 'error',
				message: 'Failed to load permissions',
			});
		} finally {
			this.loading = false;
		}
	}

	async onAddPermission() {
		const dialogRef = this.dialog.open(AddPermissionDialogComponent);

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (response) {
			this.permissions.push(response);
		}
	}

	async onUpdatePermission(permission: I_Permission) {
		const dialogRef = this.dialog.open(UpdatePermissionDialogComponent, {
			data: permission,
		});

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (response) {
			const index = this.permissions.findIndex((p) => p.id === response.id);
			this.permissions[index] = response;
		}
	}

	async onDeletePermission(permission: I_Permission) {
		if (permission.name.toLocaleLowerCase().includes('admin')) {
			this.toastService.addToast({
				type: 'error',
				message: 'You cannot delete the admin permission',
			});
			return;
		}

		const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Delete Permission',
				description: `Are you sure you want to delete the permission "${permission.name}"?`,
				isDanger: true,
			},
		});

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (!response) {
			return;
		}

		await firstValueFrom(
			this.http.delete(`${environment.apiUrl}/permissions/${permission.id}`)
		);

		this.permissions = this.permissions.filter((p) => p.id !== permission.id);
	}
}
