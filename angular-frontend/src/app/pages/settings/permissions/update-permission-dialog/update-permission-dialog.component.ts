import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { I_Permission } from 'src/app/interfaces';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-update-permission-dialog',
	templateUrl: './update-permission-dialog.component.html',
	styleUrl: './update-permission-dialog.component.scss',
})
export class UpdatePermissionDialogComponent {
	permissionFormGroup: FormGroup;
	buttonLoading = false;

	constructor(
		private http: HttpClient,
		private toastService: ToastService,
		public dialogRef: MatDialogRef<UpdatePermissionDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: I_Permission
	) {
		this.permissionFormGroup = new FormGroup({
			name: new FormControl('', Validators.required),
			description: new FormControl('', Validators.required),
		});

		this.permissionFormGroup.patchValue(data);
	}

	async onSave() {
		if (!this.permissionFormGroup.valid) {
			return;
		}

		this.buttonLoading = true;

		try {
			const response = await firstValueFrom(
				this.http.put(`${environment.apiUrl}/permissions/${this.data.id}`, {
					name: this.permissionFormGroup.value.name.toLowerCase(),
					description: this.permissionFormGroup.value.description,
				})
			);

			this.toastService.addToast({
				type: 'success',
				message: 'Permission updated successfully',
			});
			this.dialogRef.close(response);
		} catch (error: any) {
			if (error.status === 409) {
				this.toastService.addToast({
					type: 'error',
					message: 'Permission with that name already exists',
				});
			} else {
				this.toastService.addToast({
					type: 'error',
					message: 'Failed to update permission',
				});
			}
		} finally {
			this.buttonLoading = false;
		}
	}

	onCancel() {
		this.dialogRef.close();
	}
}
