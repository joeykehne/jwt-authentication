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

  @SetPermissions('iam')
  @UseGuards(AuthGuard)
  @Post()
  async createPermission(@Body() body: Permission) {
    const permission = await this.permissionService.createPermission(body);
    return permission;
  }

  @SetPermissions('iam')
  @UseGuards(AuthGuard)
  @Put(':id')
  async updatePermission(@Param('id') id: string, @Body() body: Permission) {
    const permission = await this.permissionService.updatePermission(id, body);
    return permission;
  }

  @SetPermissions('iam')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePermission(@Param('id') id: string) {
    await this.permissionService.deletePermission(id);
    return { message: 'Permission deleted successfully' };
  }

  @SetPermissions('iam')
  @UseGuards(AuthGuard)
  @Get()
  async getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }
}
