import { FormGroup } from '@angular/forms';

export interface I_ValidationResult {
	[key: string]: boolean;
}

export class ConfirmPasswordValidator {
	public static confirmPassword(form: FormGroup) {
		const password = form.get('password')?.value;
		const confirmPassword = form.get('confirmPassword')?.value;

		return password === confirmPassword ? null : { confirmPassword: true };
	}
}
