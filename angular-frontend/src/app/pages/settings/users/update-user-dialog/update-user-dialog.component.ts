import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { I_Role, I_User } from 'src/app/interfaces';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-update-user-dialog',
	templateUrl: './update-user-dialog.component.html',
	styleUrls: ['./update-user-dialog.component.scss'],
})
export class UpdateUserDialogComponent implements OnInit {
	userFormGroup: FormGroup;
	buttonLoading = false;
	roles: I_Role[] = [];
	selectedRoleIds: string[] = [];

	constructor(
		private http: HttpClient,
		private toastService: ToastService,
		public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: I_User
	) {
		this.userFormGroup = new FormGroup({
			roles: new FormControl([]),
		});
		this.selectedRoleIds = this.data.roles?.map((role) => role.id!) || [];
	}

	ngOnInit() {
		this.loadRoles();
	}

	async loadRoles() {
		try {
			this.roles = await firstValueFrom(
				this.http.get<I_Role[]>(`${environment.apiUrl}/roles`)
			);
		} catch (error) {
			this.toastService.addToast({
				type: 'error',
				message: 'Failed to load roles',
			});
		}
	}

	onRolesChanged(roleIds: string[]) {
		this.selectedRoleIds = roleIds;
		this.userFormGroup.get('roles')?.setValue(this.selectedRoleIds);
	}

	async onSave() {
		if (!this.userFormGroup.valid) {
			return;
		}

		this.buttonLoading = true;

		try {
			const response = await firstValueFrom(
				this.http.patch(`${environment.apiUrl}/users/${this.data.id}/roles`, {
					roleIds: this.selectedRoleIds,
				})
			);

			this.toastService.addToast({
				type: 'success',
				message: 'User roles updated successfully',
			});
			this.dialogRef.close(response);
		} catch (error) {
			this.toastService.addToast({
				type: 'error',
				message: 'Failed to update user roles',
			});
		} finally {
			this.buttonLoading = false;
		}
	}

	onCancel() {
		this.dialogRef.close();
	}
}
