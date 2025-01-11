import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private readonly whiteList = [
		`${environment.apiUrl}/auth/getAccessToken`,
		`${environment.apiUrl}/auth/login`,
		`${environment.apiUrl}/auth/logout`,
		`${environment.apiUrl}/auth/register`,
	];

	constructor(private authService: AuthService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		// Check if the request URL is in the whitelist
		if (this.whiteList.some((url) => request.url.includes(url))) {
			return next.handle(request);
		}

		// Get the access token using the AuthService
		return this.authService.getAccessToken().pipe(
			switchMap((accessToken) => {
				// Clone the request and add the auth header
				const authRequest = request.clone({
					headers: request.headers.set(
						'Authorization',
						`Bearer ${accessToken}`
					),
				});

				// Pass the cloned request to the next handler
				return next.handle(authRequest);
			})
		);
	}
}
