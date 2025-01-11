import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-text-loader',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './text-loader.component.html',
	styleUrls: ['./text-loader.component.scss'],
})
export class TextLoaderComponent implements OnChanges {
	@Input() loading: boolean | null = false;
	@Input() skeletonCount: number = 1;

	skeletonItems: undefined[] = [];

	ngOnChanges(changes: SimpleChanges): void {
		if (
			changes['loading'] &&
			this.loading !== null &&
			this.loading !== undefined
		) {
			this.loading = !!this.loading;
		}
		this.updateSkeletonItems();
	}

	private updateSkeletonItems(): void {
		this.skeletonItems = Array(this.skeletonCount).fill(undefined);
	}
}
