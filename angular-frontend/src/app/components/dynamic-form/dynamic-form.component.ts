import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { I_FormField } from 'src/app/interfaces';
import { ToastService } from 'src/app/services/toast.service';

@Component({
	selector: 'app-dynamic-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './dynamic-form.component.html',
	styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
	@Input() fields: I_FormField[] = [];
	@Output() formSubmit = new EventEmitter();

	form!: FormGroup;

	constructor(private fb: FormBuilder, private toastService: ToastService) {}

	ngOnInit(): void {
		this.form = this.fb.group({});
		this.fields.forEach((field) => {
			this.form.addControl(field.name, this.fb.control(field.value || ''));
		});
	}

	onSubmit(event: Event) {
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
