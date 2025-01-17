import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { I_Permission } from 'src/app/generated_interfaces';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-add-permission-dialog',
	templateUrl: './add-permission-dialog.component.html',
	styleUrl: './add-permission-dialog.component.scss',
})
export class AddPermissionDialogComponent {
	permissionFormGroup: FormGroup;
	buttonLoading = false;

	constructor(
		private http: HttpClient,
		private toastService: ToastService,
		public dialogRef: MatDialogRef<AddPermissionDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: I_Permission
	) {
		this.permissionFormGroup = new FormGroup({
			name: new FormControl('', Validators.required),
			description: new FormControl('', Validators.required),
		});
	}

	async onSave() {
		if (!this.permissionFormGroup.valid) {
			return;
		}

		this.buttonLoading = true;

		try {
			const response = await firstValueFrom(
				this.http.post(`${environment.apiUrl}/permissions`, {
					name: this.permissionFormGroup.value.name.toLowerCase(),
					description: this.permissionFormGroup.value.description,
				})
			);

			this.toastService.addToast({
				type: 'success',
				message: 'Permission added successfully',
			});
			this.dialogRef.close(response);
		} catch (error) {
			this.toastService.addToast({
				type: 'error',
				message: 'Failed to add permission',
			});
		} finally {
			this.buttonLoading = false;
		}
	}

	onCancel() {
		this.dialogRef.close();
	}
}
