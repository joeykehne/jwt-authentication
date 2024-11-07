import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
	providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
		private toastService: ToastService
	) {}

	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		const requiredPermission = route.data['requiredPermission'];

		// Get the access token
		return this.authService.getAccessToken().pipe(
			switchMap((token) => {
				if (token) {
					// Send permission check request to backend
					return this.authService.canAccess(requiredPermission).pipe(
						switchMap((hasPermission) => {
							if (hasPermission) {
								return of(true);
							} else {
								this.toastService.addToast({
									message: 'You are not authorized to access this page',
									type: 'error',
								});
								return of(false);
							}
						}),
						catchError(() => {
							this.toastService.addToast({
								message: 'An error occurred. Please try again',
								type: 'error',
							});
							return of(false);
						})
					);
				} else {
					this.toastService.addToast({
						message: 'You need to login to access this page',
						type: 'error',
					});
					this.router.navigate(['/login']);
					return of(false);
				}
			}),
			catchError(() => {
				this.toastService.addToast({
					message: 'An error occurred. Please try again',
					type: 'error',
				});
				this.router.navigate(['/login']);
				return of(false);
			})
		);
	}
}
