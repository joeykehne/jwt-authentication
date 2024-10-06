import { inject } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivateFn,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
	const authService = inject(AuthService);
	const router = inject(Router);

	const token = await authService.getAccessToken();

	try {
		if (token) {
			return true; // User has a valid token
		} else {
			return router.parseUrl('/login'); // Redirect to login if no valid token
		}
	} catch (e) {
		return router.parseUrl('/login'); // Redirect on error
	}
};
