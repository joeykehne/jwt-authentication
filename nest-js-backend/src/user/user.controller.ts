import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Find all users
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  // Assign roles to a user
  @Patch(':id/roles')
  async assignRoles(
    @Param('id') userId: string,
    @Body('roleIds') roleIds: string[],
  ) {
    const updatedUser = await this.userService.assignRoles(userId, roleIds);
    return updatedUser;
  }
}
