import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(): Observable<boolean> {
		return this.authService.getAccessToken().pipe(
			switchMap((token) => {
				if (!token) {
					return of(true);
				} else {
					// If there is a token, redirect to home
					this.router.navigate(['/']);
					return of(false);
				}
			}),
			catchError(() => {
				// Handle any errors and redirect to login
				return of(true);
			})
		);
	}
}
