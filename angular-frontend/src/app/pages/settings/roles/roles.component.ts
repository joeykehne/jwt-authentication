import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';
import { I_Role } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { AddRoleDialogComponent } from './add-role-dialog/add-role-dialog.component';
import { UpdateRoleDialogComponent } from './update-role-dialog/update-role-dialog.component';

@Component({
	selector: 'app-roles',
	templateUrl: './roles.component.html',
	styleUrl: './roles.component.scss',
})
export class RolesComponent {
	roles: I_Role[] = [];

	constructor(private http: HttpClient, private dialog: MatDialog) {}

	async ngOnInit() {
		await this.reloadRoles();
	}
	async reloadRoles() {
		this.roles = await firstValueFrom(
			this.http.get<I_Role[]>(`${environment.apiUrl}/roles`)
		);
	}

	async onAddRole() {
		const dialogRef = this.dialog.open(AddRoleDialogComponent);

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (response) {
			this.roles.push(response);
		}
	}

	async onUpdateRole(role: I_Role) {
		const dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
			data: role,
		});

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (response) {
			const index = this.roles.findIndex((r) => r.id === response.id);
			this.roles[index] = response;
		}
	}

	async onDeleteRole(role: I_Role) {
		const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Delete Role',
				description: `Are you sure you want to delete the role "${role.name}"?`,
				isDanger: true,
			},
		});

		const response = await firstValueFrom(dialogRef.afterClosed());

		if (!response) {
			return;
		}

		await firstValueFrom(
			this.http.delete(`${environment.apiUrl}/roles/${role.id}`)
		);

		this.roles = this.roles.filter((r) => r.id !== role.id);
	}
}
