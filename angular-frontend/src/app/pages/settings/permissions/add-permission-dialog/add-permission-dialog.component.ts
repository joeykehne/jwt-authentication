import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-add-permission-dialog',
	templateUrl: './add-permission-dialog.component.html',
	styleUrl: './add-permission-dialog.component.scss',
})
export class AddPermissionDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<AddPermissionDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	onSave() {
		console.log('Permission saved');
	}

	onCancel() {
		console.log('Permission canceled');
	}
}
