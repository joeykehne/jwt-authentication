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
  async createRole(name: string): Promise<Role> {
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  // Get all roles
  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  // Assign permissions to a role
  async assignPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions =
      await this.permissionRepository.findByIds(permissionIds);
    role.permissions = permissions;
    return this.roleRepository.save(role);
  }

  // Other CRUD operations as needed
}
