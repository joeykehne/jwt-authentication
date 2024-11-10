import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ConfirmationData {
	title: string;
	description: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
	isDanger?: boolean;
}

@Component({
	selector: 'app-confirmation-dialog',
	templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
	title: string;
	description: string;
	confirmButtonText: string;
	cancelButtonText: string;
	isDanger: boolean;

	constructor(
		private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmationData
	) {
		this.title = data.title;
		this.description = data.description;
		this.confirmButtonText = data.confirmButtonText || 'OK';
		this.cancelButtonText = data.cancelButtonText || 'Cancel';
		this.isDanger = data.isDanger || false;
	}

	onConfirm(): void {
		this.dialogRef.close(true);
	}

	onCancel(): void {
		this.dialogRef.close(false);
	}
}
