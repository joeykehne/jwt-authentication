import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';
import { I_Permission } from 'src/app/interfaces';
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

	constructor(private http: HttpClient, private dialog: MatDialog) {}

	async ngOnInit() {
		await this.reloadPermissions();
	}

	async reloadPermissions() {
		this.permissions = await firstValueFrom(
			this.http.get<I_Permission[]>(`${environment.apiUrl}/permissions`)
		);
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
