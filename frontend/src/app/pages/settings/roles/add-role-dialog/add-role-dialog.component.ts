import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { I_Permission } from 'src/app/interfaces';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-add-role-dialog',
	templateUrl: './add-role-dialog.component.html',
	styleUrls: ['./add-role-dialog.component.scss'],
})
export class AddRoleDialogComponent implements OnInit {
	roleFormGroup: FormGroup;
	buttonLoading = false;
	permissions: I_Permission[] = [];
	filteredPermissions: I_Permission[] = [];
	selectedPermissionIds: string[] = [];

	constructor(
		private http: HttpClient,
		private toastService: ToastService,
		public dialogRef: MatDialogRef<AddRoleDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.roleFormGroup = new FormGroup({
			name: new FormControl('', Validators.required),
			permissions: new FormControl([]),
			permissionSearch: new FormControl(''),
		});
	}

	ngOnInit() {
		this.loadPermissions();
	}

	async loadPermissions() {
		try {
			this.permissions = await firstValueFrom(
				this.http.get<I_Permission[]>(`${environment.apiUrl}/permissions`)
			);
			this.filteredPermissions = [...this.permissions];
		} catch (error) {
			this.toastService.addToast({
				type: 'error',
				message: 'Failed to load permissions',
			});
		}
	}

	isSelected(permission: I_Permission): boolean {
		return this.selectedPermissionIds.includes(permission.id!);
	}

	togglePermission(permission: I_Permission) {
		if (this.isSelected(permission)) {
			this.selectedPermissionIds = this.selectedPermissionIds.filter(
				(id) => id !== permission.id
			);
		} else {
			this.selectedPermissionIds.push(permission.id!);
		}
		this.updatePermissionsFormControl();
	}

	updatePermissionsFormControl() {
		this.roleFormGroup.get('permissions')?.setValue(this.selectedPermissionIds);
	}

	async onSave() {
		if (!this.roleFormGroup.valid) {
			return;
		}

		this.buttonLoading = true;

		try {
			const response = await firstValueFrom(
				this.http.post(`${environment.apiUrl}/roles`, {
					name: this.roleFormGroup.value.name,
					permissionIds: this.selectedPermissionIds,
				})
			);

			this.toastService.addToast({
				type: 'success',
				message: 'Role added successfully',
			});
			this.dialogRef.close(response);
		} catch (error) {
			this.toastService.addToast({
				type: 'error',
				message: 'Failed to add role',
			});
		} finally {
			this.buttonLoading = false;
		}
	}

	onCancel() {
		this.dialogRef.close();
	}
}
