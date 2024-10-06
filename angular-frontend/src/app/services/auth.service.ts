import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { catchError, firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _acccessToken: string | null = null;

  constructor(private http: HttpClient) {}

  get accessToken(): string | null {
    return this._acccessToken;
  }

  set accessToken(token: string | null) {
    this._acccessToken = token;
  }

  async login({ email, password }: { email: string; password: string }) {
    const response = await firstValueFrom(
      this.http.post<{ accessToken: string }>(
        `${environment.apiUrl}/auth/login`,
        { email, password },
        {
          withCredentials: true,
        }
      )
    );

    this.accessToken = response.accessToken;
  }

  async register() {
    const user: { email: string; password: string } = {
      email: 'info@kehne-it.de',
      password: 'password',
    };

    const response = await firstValueFrom(
      this.http.post<{ accessToken: string }>(
        `${environment.apiUrl}/auth/register`,
        user,
        {
          withCredentials: true,
        }
      )
    );

    this.accessToken = response.accessToken;
  }

  async getAccessToken(): Promise<string | null> {
    if (this.accessToken && !this.isTokenExpired(this.accessToken)) {
      return this.accessToken;
    }

    console.log('Fetching new access token');

    const token = await firstValueFrom(
      this.http
        .get<{ accessToken: string }>(
          `${environment.apiUrl}/auth/getAccessToken`,
          {
            withCredentials: true,
          }
        )
        .pipe(
          map((response) => response.accessToken),
          catchError(() => {
            return [null];
          })
        )
    );

    this.accessToken = token;

    return token;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwt_decode.jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return true; // if there's an error, consider the token expired
    }
  }
}
