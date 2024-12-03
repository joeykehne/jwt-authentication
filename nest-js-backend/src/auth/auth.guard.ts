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
    const requiredPermissionsHandler = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const requiredPermissionsClass = this.reflector.get<string[]>(
      'permissions',
      context.getClass(),
    );

    const requiredPermissions = [
      ...(requiredPermissionsHandler || []),
      ...(requiredPermissionsClass || []),
    ];

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) throw new UnauthorizedException('No token provided');

    const [, tokenValue] = token.split(' ');

    if (!tokenValue) throw new UnauthorizedException('No token provided');

    const user = await this.authService.validateToken(tokenValue, 'access');
    request.user = user;

    const userPermissions = user.roles
      .flatMap((role) => role.permissions)
      .map((permission) => permission.name);

    if (userPermissions.includes('admin')) {
      return true;
    }

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
