import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(): Observable<boolean> {
		return this.authService.getAccessToken().pipe(
			switchMap((token) => {
				if (token) {
					return of(true);
				} else {
					// Token is not available, redirect to login
					this.router.navigate(['/login']);
					return of(false);
				}
			}),
			catchError(() => {
				// Handle any errors and redirect to login
				this.router.navigate(['/login']);
				return of(false);
			})
		);
	}
}
