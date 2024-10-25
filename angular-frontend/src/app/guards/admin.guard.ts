import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
	providedIn: 'root',
})
export class AdminGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
		private toastService: ToastService
	) {}

	canActivate(): Observable<boolean> {
		return this.authService.getAccessToken().pipe(
			switchMap((token) => {
				if (token) {
					// Token is available, check for role
					const decodedToken: any = jwt_decode.jwtDecode(token);

					if (decodedToken.roles.includes('admin')) {
						// User is an admin, allow access
						return of(true);
					}

					this.toastService.addToast({
						message: 'You are not authorized to access this page',
						type: 'alert-error',
					});

					this.router.navigate(['/']);
					return of(false);
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
