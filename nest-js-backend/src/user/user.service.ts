import {
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role/role.entity';
import { S3Service } from 'src/services/s3.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly s3Service: S3Service,
  ) {}

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  // Assign roles to a user
  async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.roleRepository.findByIds(roleIds);
    user.roles = roles;

    return this.userRepository.save(user);
  }

  async getProfilePicture(
    userId: string,
  ): Promise<{ buffer: Buffer; contentType: string }> {
    // Construct the S3 key for the user's profile picture
    const fileKey = `profile-pictures/${userId}`;

    try {
      // Get the file from S3 using the key
      return await this.s3Service.getFile(fileKey);
    } catch (error) {
      // Handle the case where the file is not found in S3
      throw new NotFoundException('Profile picture not found');
    }
  }

  async uploadProfilePicture(user: User, file: Express.Multer.File) {
    // Check file type
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedFileTypes.includes(file.mimetype)) {
      throw new NotFoundException('Invalid file type');
    }

    // Check file size
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      throw new PayloadTooLargeException('File size exceeds the limit');
    }

    // Delete old profile picture if it exists
    if (user.profilePictureUrl) {
      await this.s3Service.deleteFile(user.profilePictureUrl);
    }

    const key = `profile-pictures/${user.id}`;
    await this.s3Service.uploadFile(key, file.buffer, file.mimetype);
    user.profilePictureUrl = key;
    await this.userRepository.save(user);
  }
}
