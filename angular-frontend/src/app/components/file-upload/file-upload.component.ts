import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';

@Component({
	standalone: true,
	imports: [CommonModule],
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
	@Input() label: string = 'Upload File';
	@Input() buttonText: string = 'Upload';
	@Input() accept: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
	@Input() maxMbSize: number = 5; // 5MB
	@Input() showUploadInformation = true;
	@Input() showReselectFileText = true;
	@Output()
	fileSelected: EventEmitter<File> = new EventEmitter<File>();

	file: File | null = null;
	fileName: string = '';
	fileSize: number | null = null; // File size in KB
	isDragOver: boolean = false;

	constructor(private toastService: ToastService) {}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			this.processFile(input.files[0]);
		}
	}

	onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragOver = false;

		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			this.processFile(event.dataTransfer.files[0]);
			event.dataTransfer.clearData();
		}
	}

	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragOver = true;
	}

	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragOver = false;
	}

	processFile(file: File): void {
		const allowedTypes = this.accept;
		const maxSize = this.maxMbSize;

		if (
			allowedTypes.includes(file.type) &&
			file.size <= maxSize * 1024 * 1024
		) {
			this.file = file;
			this.fileName = file.name;
			this.fileSize = Math.round(file.size / 1024);
			this.fileSelected.emit(file);
		} else {
			const acceptedTypes = allowedTypes.join(', ');
			const maxSizeMb = maxSize + 'MB';

			this.toastService.addToast({
				message: `Invalid file. Please upload a valid file (${acceptedTypes}) that is less than ${maxSizeMb}`,
				type: 'error',
			});
		}
	}

	triggerFileSelect(): void {
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		fileInput.click();
	}
}
