import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, firstValueFrom, tap } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmPasswordValidator } from 'src/app/validators/confirmPassword.validator';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-change-password-dialog',
	templateUrl: './change-password-dialog.component.html',
	styleUrl: './change-password-dialog.component.scss',
})
export class ChangePasswordDialogComponent {
	form: FormGroup;
	private changePasswordToken: string | null = null;
	gettingToken = true;
	changingPassword = false;
	oldPasswordCorrect = false;
	verifyingOldPassword = false;

	constructor(
		private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpClient,
		private toastService: ToastService,
		private fb: FormBuilder
	) {
		this.form = this.fb.group(
			{
				oldPassword: ['', [Validators.required]],
				password: ['', [Validators.required, PasswordValidator.password]],
				confirmPassword: ['', [Validators.required]],
			},
			{ validators: [ConfirmPasswordValidator.confirmPassword] }
		);
	}

	async ngOnInit() {
		await this.requestChangePasswordToken();
		this.gettingToken = false;

		this.form
			.get('oldPassword')
			?.valueChanges.pipe(
				tap(() => {
					this.oldPasswordCorrect = false;
					this.verifyingOldPassword = true;
					this.form.get('oldPassword')?.setErrors({ incorrect: true });
				}),
				debounceTime(1500)
			)
			.subscribe(async (oldPassword) => {
				if (oldPassword) {
					try {
						const passwordIsCorrect = await firstValueFrom(
							this.http.post<boolean>(
								`${environment.apiUrl}/auth/verifyOldPassword`,
								{
									password: oldPassword,
								}
							)
						);

						if (!passwordIsCorrect) {
							this.form.get('oldPassword')?.setErrors({ incorrect: true });
							this.form.get('oldPassword')?.markAsTouched();
							this.oldPasswordCorrect = false;
						} else {
							this.form.get('oldPassword')?.setErrors(null);
							this.oldPasswordCorrect = true;
						}

						this.verifyingOldPassword = false;
					} catch (e: any) {
						this.toastService.addToast({
							message: 'Something went wrong. Please try again later',
							type: 'error',
						});
						this.onCancel();
					}
				}
			});
	}

	async requestChangePasswordToken() {
		try {
			const repoonse = await firstValueFrom(
				this.http.get<{ token: string }>(
					`${environment.apiUrl}/auth/requestChangePasswordToken`
				)
			);

			if (!repoonse.token) {
				throw new Error('No token');
			}

			this.changePasswordToken = repoonse.token;
		} catch (e: any) {
			this.toastService.addToast({
				message: 'Something went wrong. Please try again later',
				type: 'error',
			});
			this.onCancel();
		}
	}

	async onConfirm() {
		if (this.form.invalid) {
			return;
		}

		this.changingPassword = true;

		try {
			await firstValueFrom(
				this.http.post(`${environment.apiUrl}/auth/changePassword`, {
					token: this.changePasswordToken,
					password: this.form.value.password,
				})
			);

			this.toastService.addToast({
				message: 'Password changed successfully',
				type: 'success',
			});

			this.dialogRef.close();
		} catch (e: any) {
			this.toastService.addToast({
				message: 'Something went wrong. Please try again later',
				type: 'error',
			});
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
