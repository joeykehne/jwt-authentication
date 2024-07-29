import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
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
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;

      // Check if the authorization header is present and not empty
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }

      // Extract the token from the authorization header
      const authToken = authorization.replace(/bearer/gim, '').trim();

      // Validate the token using AuthService
      const resp = await this.authService.validateToken(authToken);

      // Attach the decoded data to the request object
      request.decodedData = resp;

      // Allow the request to proceed
      return true;
    } catch (error) {
      // Throw a forbidden exception if token validation fails or another error occurs
      throw new ForbiddenException(
        error.message || 'Session expired! Please sign in',
      );
    }
  }
}
