import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { I_Toast } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class ToastService {
	public toasts: I_Toast[] = [];
	constructor() {}

	addToast(toast: I_Toast) {
		toast.id = uuid.v4();

		this.toasts.push(toast);

		setTimeout(() => {
			this.toasts = this.toasts.filter((listToast) => listToast.id != toast.id);
		}, 4000);
	}
}
