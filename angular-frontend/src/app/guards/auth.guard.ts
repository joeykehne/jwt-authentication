import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
		private toastService: ToastService
	) {}

	canActivate(): Observable<boolean> {
		return this.authService.getAccessToken().pipe(
			switchMap((token) => {
				if (token) {
					return of(true);
				} else {
					this.toastService.addToast({
						message: 'You need to login to access this page',
						type: 'alert-error',
					});

					// Token is not available, redirect to login
					this.router.navigate(['/login']);
					return of(false);
				}
			}),
			catchError(() => {
				this.toastService.addToast({
					message: 'An error occurred. Please try again',
					type: 'alert-error',
				});

				// Handle any errors and redirect to login
				this.router.navigate(['/login']);
				return of(false);
			})
		);
	}
}
