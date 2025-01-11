import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  // Update a permission
  async updatePermission(id: string, body: Permission): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ id });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const nameExists = await this.permissionRepository.findOne({
      where: { name: body.name },
    });

    if (nameExists && nameExists.id !== id) {
      throw new ConflictException('Permission with this name already exists');
    }

    Object.assign(permission, body);

    return this.permissionRepository.save(permission);
  }

  // Delete a permission
  async deletePermission(id: string): Promise<void> {
    await this.permissionRepository.delete({ id });
  }

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }
}
