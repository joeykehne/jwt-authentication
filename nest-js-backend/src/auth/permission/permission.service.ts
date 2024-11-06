import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // Create a new permission
  async createPermission(name: string): Promise<Permission> {
    const permission = this.permissionRepository.create({ name });
    return this.permissionRepository.save(permission);
  }

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }
}