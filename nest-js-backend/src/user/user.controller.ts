import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SetPermissions } from 'src/auth/permission/permissions.decorator';
import { UserService } from './user.service';

@SetPermissions('iam')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@Req() req: any) {
    return this.userService.findOne(req.user);
  }

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
