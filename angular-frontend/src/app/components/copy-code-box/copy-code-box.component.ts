import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	standalone: true,
	imports: [CommonModule],
	selector: 'app-copy-code-box',
	templateUrl: './copy-code-box.component.html',
	styleUrls: ['./copy-code-box.component.scss'],
})
export class CopyCodeBoxComponent {
	@Input() text: string = '';

	isClicked = false;

	constructor(private clipboard: Clipboard) {}

	onCopy() {
		this.clipboard.copy(this.text);
		this.isClicked = true;

		setTimeout(() => {
			this.isClicked = false;
		}, 1500);
	}
}
