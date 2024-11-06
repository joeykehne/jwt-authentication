import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role/role.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Assign roles to a user
  async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { _id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.roleRepository.findByIds(roleIds);
    user.roles = roles;
    return this.userRepository.save(user);
  }
}
