// src/auth/role/role.controller.ts
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
import { SetPermissions } from '../permission/permissions.decorator';
import { RoleService } from './role.service';

@SetPermissions('iam')
@UseGuards(AuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // Create a new role
  @Post()
  async createRole(@Body() body: { name: string; permissionIds: string[] }) {
    const { name, permissionIds } = body;
    const role = await this.roleService.createRole(name, permissionIds);
    return role;
  }

  // Update an existing role
  @Put(':id')
  async updateRole(
    @Param('id') roleId: string,
    @Body() body: { name?: string; permissionIds?: string[] },
  ) {
    console.log('body', body);

    const { name, permissionIds } = body;
    const updatedRole = await this.roleService.updateRole(
      roleId,
      name,
      permissionIds,
    );
    return updatedRole;
  }

  // Delete a role
  @Delete(':id')
  async deleteRole(@Param('id') roleId: string) {
    await this.roleService.deleteRole(roleId);
    return { message: 'Role deleted successfully' };
  }

  // Get all roles
  @Get()
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }
}
