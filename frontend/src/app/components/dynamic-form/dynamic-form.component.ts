import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { I_FormField, I_Validator } from 'src/app/interfaces';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmPasswordValidator } from 'src/app/validators/confirmPassword.validator';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { LoadingComponent } from '../loading/loading.component';

@Component({
	selector: 'app-dynamic-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
	templateUrl: './dynamic-form.component.html',
	styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit {
	@Input() fields: I_FormField[] = [];
	@Input() submitText = 'Submit';
	@Input() submitLoading = false;
	@Output() formSubmit = new EventEmitter();

	form!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private toastService: ToastService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		const group: { [key: string]: any } = {};
		this.fields.forEach((field) => {
			const validators = this.mapValidators(field.validators);
			group[field.name] = [field.value || '', validators];
		});

		const groupValidators = this.getGroupValidators(this.fields);

		this.form = this.fb.group(group, {
			validators: groupValidators,
		});
	}

	ngAfterViewInit() {
		this.cdRef.detectChanges();
	}

	getFieldErrors(field: I_FormField): string[] {
		const control = this.form.get(field.name);
		if (!control || !control.errors) return [];

		return Object.keys(control.errors).map((errorKey) => {
			const validator = field.validators?.find(
				(v) => v.name.toLowerCase() === errorKey.toLowerCase()
			);

			return (
				validator?.message ||
				this.getDefaultErrorMessage(errorKey, field.label, validator?.value)
			);
		});
	}

	private mapValidators(validators?: I_Validator[]) {
		if (!validators) return [];
		return validators.map((validator) => {
			switch (validator.name) {
				case 'required':
					return Validators.required;
				case 'minLength':
					return Validators.minLength(validator.value);
				case 'maxLength':
					return Validators.maxLength(validator.value);
				case 'pattern':
					return Validators.pattern(validator.value);
				case 'password':
					return PasswordValidator.password;
				case 'email':
					return Validators.email;
				default:
					return Validators.nullValidator;
			}
		});
	}

	getGroupValidators(fields: I_FormField[]): any[] {
		const validators = [];

		if (fields.some((field) => field.name === 'confirmPassword')) {
			validators.push(ConfirmPasswordValidator.confirmPassword);
		}

		return validators;
	}

	private getDefaultErrorMessage(
		errorKey: string,
		label: string,
		value?: any
	): string {
		switch (errorKey) {
			case 'required':
				return '';
			case 'email':
				return 'Please enter a valid email address.';
			case 'password':
				return `${label} must contain at least one uppercase letter, one lowercase letter, and one number.`;
			case 'confirmPassword':
				return 'Passwords do not match.';
			case 'minlength':
				return `${label} must be at least ${value} characters long.`;
			case 'maxlength':
				return `${label} must be less than ${value} characters long.`;
			default:
				return `${label} is invalid.`;
		}
	}

	async isFormInvalid(): Promise<boolean> {
		return this.form.invalid;
	}

	async onSubmit(event: Event) {
		if (this.form.invalid) {
			this.toastService.addToast({
				message: 'Please fill out all required fields',
				type: 'error',
			});
			return;
		}

		event.preventDefault();
		this.formSubmit.emit(this.form.value);
	}
}
