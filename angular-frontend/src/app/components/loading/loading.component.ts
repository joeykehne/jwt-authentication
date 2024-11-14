import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	standalone: true,
	imports: [CommonModule],
	selector: 'app-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {}
