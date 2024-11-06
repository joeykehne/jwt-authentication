import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) throw new UnauthorizedException('No token provided');

    const [, tokenValue] = token.split(' ');

    if (!tokenValue) throw new UnauthorizedException('No token provided');

    const user = await this.authService.validateToken(tokenValue);
    request.user = user;

    if (
      !requiredPermissions ||
      user.roles.some((role) => role.name === 'admin')
    ) {
      return true;
    }

    const userPermissions = user.roles
      .flatMap((role) => role.permissions)
      .map((permission) => permission.name);

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
