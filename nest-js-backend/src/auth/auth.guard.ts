import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  /**
   * Determines if the current request can proceed based on the provided authorization token.
   * @param context The execution context of the request.
   * @returns A boolean indicating whether the request can proceed.
   * @throws UnauthorizedException if no token is provided.
   * @throws ForbiddenException if the token is invalid or an error occurs during validation.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request object
    const request = context.switchToHttp().getRequest();

    // get token from headers
    const token = request.headers['authorization'];

    // split token
    const [_, tokenValue] = token.split(' ');

    // Check if token is provided
    if (!tokenValue) throw new UnauthorizedException('No token provided');

    // Check if token is valid
    const tokenValid = this.authService.validateToken(tokenValue);

    // Return true if token is valid
    return tokenValid;
  }
}
