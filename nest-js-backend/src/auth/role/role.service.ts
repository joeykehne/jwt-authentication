// src/auth/role/role.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permission/permission.entity';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // Create a new role
  async createRole(name: string, permissionIds: string[]): Promise<Role> {
    const permissions =
      await this.permissionRepository.findByIds(permissionIds);
    const role = this.roleRepository.create({ name, permissions });
    return this.roleRepository.save(role);
  }

  // Update an existing role
  async updateRole(
    roleId: string,
    name?: string,
    permissionIds?: string[],
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (name !== undefined) {
      role.name = name;
    }
    if (permissionIds !== undefined) {
      const permissions =
        await this.permissionRepository.findByIds(permissionIds);
      role.permissions = permissions;
    }

    return this.roleRepository.save(role);
  }

  // Delete a role
  async deleteRole(roleId: string): Promise<void> {
    const result = await this.roleRepository.delete({ id: roleId });
    if (result.affected === 0) {
      throw new NotFoundException('Role not found');
    }
  }

  // Get all roles
  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }
}
