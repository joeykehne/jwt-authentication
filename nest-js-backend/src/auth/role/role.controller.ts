import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from '../role/role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // Create a new role
  @Post()
  async createRole(@Body('name') name: string) {
    const role = await this.roleService.createRole(name);
    return role;
  }

  // Get all roles
  @Get()
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }

  // Assign permissions to a role
  @Patch(':id/permissions')
  async assignPermissions(
    @Param('id') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    const updatedRole = await this.roleService.assignPermissions(
      roleId,
      permissionIds,
    );
    return updatedRole;
  }
}
