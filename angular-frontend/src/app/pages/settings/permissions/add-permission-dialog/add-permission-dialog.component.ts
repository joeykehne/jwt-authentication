import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-add-permission-dialog',
	templateUrl: './add-permission-dialog.component.html',
	styleUrl: './add-permission-dialog.component.scss',
})
export class AddPermissionDialogComponent {
	permissionFormGroup: FormGroup;

	constructor(
		private http: HttpClient,
		private toastService: ToastService,
		public dialogRef: MatDialogRef<AddPermissionDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
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

		const response = await firstValueFrom(
			this.http.post(`${environment.apiUrl}/permissions`, {
				name: this.permissionFormGroup.value.name.toLowerCase(),
				description: this.permissionFormGroup.value.description,
			})
		);

		if (response) {
			this.toastService.addToast({
				type: 'success',
				message: 'Permission added successfully',
			});
			this.dialogRef.close(response);

			return;
		}
		this.toastService.addToast({
			type: 'error',
			message: 'Failed to add permission',
		});
	}

	onCancel() {
		this.dialogRef.close();
	}
}
