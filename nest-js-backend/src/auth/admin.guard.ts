import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request object
    const request = context.switchToHttp().getRequest();

    // get token from headers
    const token = request.headers['authorization'];

    if (!token) throw new UnauthorizedException('No token provided');

    // split token
    const [_, tokenValue] = token.split(' ');

    // Check if token is provided
    if (!tokenValue) throw new UnauthorizedException('No token provided');

    // Check if token is valid
    const tokenValid = this.authService.validateToken(tokenValue);

    if (!tokenValid.roles.includes('admin')) {
      throw new UnauthorizedException('Unauthorized');
    }

    // add user to request object
    request.user = tokenValid;

    // Return true if token is valid
    return tokenValid;
  }
}
