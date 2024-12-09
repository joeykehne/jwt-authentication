import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { SetPermissions } from 'src/auth/permission/permissions.decorator';
import { Public } from 'src/auth/public.decorator';
import { UserService } from './user.service';

@SetPermissions('iam')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@Req() req: any) {
    return req.user;
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

  @Get('profilePicture/:id')
  @Public()
  async getProfilePicture(@Param('id') id: string, @Res() res: Response) {
    const fileData = await this.userService.getProfilePicture(id);

    if (!fileData) {
      throw new NotFoundException('Profile picture not found');
    }

    const { buffer, contentType } = fileData;

    // Set the correct Content-Type header for the image
    res.set('Content-Type', contentType);

    // Send the buffer as the response body
    res.send(buffer);
  }

  @Post('profilePicture')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.user;

    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.uploadProfilePicture(user, file);
  }
}
