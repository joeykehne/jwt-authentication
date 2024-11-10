import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // Create a new permission
  async createPermission(body: Permission): Promise<Permission> {
    const permission = this.permissionRepository.create(body);
    return this.permissionRepository.save(permission);
  }

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }
}
