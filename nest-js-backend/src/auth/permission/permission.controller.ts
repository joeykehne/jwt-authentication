import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';
import { SetPermissions } from './permissions.decorator';

@SetPermissions('iam')
@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Create a new permission
  @Post()
  async createPermission(@Body() body: Permission) {
    const permission = await this.permissionService.createPermission(body);
    return permission;
  }

  // update a permission
  @Put(':id')
  async updatePermission(@Param('id') id: string, @Body() body: Permission) {
    const permission = await this.permissionService.updatePermission(id, body);
    return permission;
  }

  // delete a permission
  @Delete(':id')
  async deletePermission(@Param('id') id: string) {
    await this.permissionService.deletePermission(id);
    return { message: 'Permission deleted successfully' };
  }

  // Get all permissions
  @Get()
  async getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }
}
