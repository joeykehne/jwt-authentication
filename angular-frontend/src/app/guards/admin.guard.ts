import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AdminGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

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
					this.router.navigate(['/']);
					return of(false);
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
