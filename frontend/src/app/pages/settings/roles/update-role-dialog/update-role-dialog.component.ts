import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { I_Permission, I_Role } from 'src/app/generated_interfaces';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-update-role-dialog',
	templateUrl: './update-role-dialog.component.html',
	styleUrls: ['./update-role-dialog.component.scss'],
})
export class UpdateRoleDialogComponent implements OnInit {
	roleFormGroup: FormGroup;
	buttonLoading = false;
	permissions: I_Permission[] = [];
	selectedPermissionIds: string[] = [];

	constructor(
		private http: HttpClient,
		private toastService: ToastService,
		public dialogRef: MatDialogRef<UpdateRoleDialogComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: I_Role & { permissions: I_Permission[] }
	) {
		this.roleFormGroup = new FormGroup({
			name: new FormControl('', Validators.required),
			permissions: new FormControl([]),
		});
	}

	ngOnInit() {
		this.populateForm();
		this.loadPermissions();
	}

	populateForm() {
		this.roleFormGroup.patchValue({
			name: this.data.name,
			permissions: this.data.permissions.map((p) => p.id),
		});
		this.selectedPermissionIds = this.data.permissions.map((p) => p.id!);
	}

	async loadPermissions() {
		try {
			this.permissions = await firstValueFrom(
				this.http.get<I_Permission[]>(`${environment.apiUrl}/permissions`)
			);
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

	onPermissionChange(event: Event, permission: I_Permission) {
		const isChecked = (event.target as HTMLInputElement).checked;
		if (isChecked) {
			this.selectedPermissionIds.push(permission.id!);
		} else {
			this.selectedPermissionIds = this.selectedPermissionIds.filter(
				(id) => id !== permission.id
			);
		}
		this.roleFormGroup.get('permissions')?.setValue(this.selectedPermissionIds);
	}

	async onSave() {
		if (!this.roleFormGroup.valid) {
			return;
		}

		this.buttonLoading = true;

		try {
			const response = await firstValueFrom(
				this.http.put(`${environment.apiUrl}/roles/${this.data.id}`, {
					name: this.roleFormGroup.value.name,
					permissionIds: this.selectedPermissionIds,
				})
			);

			this.toastService.addToast({
				type: 'success',
				message: 'Role updated successfully',
			});
			this.dialogRef.close(response);
		} catch (error) {
			this.toastService.addToast({
				type: 'error',
				message: 'Failed to update role',
			});
		} finally {
			this.buttonLoading = false;
		}
	}

	onCancel() {
		this.dialogRef.close();
	}
}
