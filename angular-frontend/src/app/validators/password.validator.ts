import { FormControl } from '@angular/forms';

export interface I_ValidationResult {
	[key: string]: boolean;
}

export class PasswordValidator {
	public static strong(control: FormControl) {
		let hasNumber = /\d/.test(control.value);
		let hasUpper = /[A-Z]/.test(control.value);
		let hasLower = /[a-z]/.test(control.value);
		const valid = hasNumber && hasUpper && hasLower;
		if (!valid) {
			return { strong: true };
		}
		return null;
	}
}
