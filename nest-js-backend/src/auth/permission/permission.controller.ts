import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Create a new permission
  @Post()
  async createPermission(@Body('name') name: string) {
    const permission = await this.permissionService.createPermission(name);
    return permission;
  }

  // Get all permissions
  @Get()
  async getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }
}
