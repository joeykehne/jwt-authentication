import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
} from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
	selector: 'app-image-loader',
	standalone: true,
	imports: [CommonModule, FileUploadComponent],
	templateUrl: './image-loader.component.html',
	styleUrl: './image-loader.component.scss',
})
export class ImageLoaderComponent implements OnChanges {
	@Input() src!: string; // Image source input
	@Input() defaultImage: string = 'assets/images/no-image.svg'; // Fallback image
	@Input() size: '32' | '64' | '128' = '64';
	@Input() showUpload = false;
	@Output() fileSelected = new EventEmitter<File>();

	isLoading = true;
	imageSrc!: string;
	loadingTimeout: number = 5000; // Timeout for loading in milliseconds

	private timeoutId: any;

	ngOnChanges(): void {
		this.startLoadingImage();
	}

	startLoadingImage(): void {
		this.isLoading = true;
		this.imageSrc = this.src;

		// Set a timeout for loading
		this.timeoutId = setTimeout(() => {
			if (this.isLoading) {
				this.onImageError();
			}
		}, this.loadingTimeout);
	}

	onImageLoad(): void {
		this.isLoading = false;
		clearTimeout(this.timeoutId);
	}

	onImageError(): void {
		this.isLoading = false;
		clearTimeout(this.timeoutId);
		this.imageSrc = this.defaultImage;
	}

	onFileSelected(file: any): void {
		this.fileSelected.emit(file);
	}
}
