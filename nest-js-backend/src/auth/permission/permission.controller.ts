import { Body, Controller, Get, Post } from '@nestjs/common';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Create a new permission
  @Post()
  async createPermission(@Body() body: Permission) {
    const permission = await this.permissionService.createPermission(body);
    return permission;
  }

  // Get all permissions
  @Get()
  async getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }
}
