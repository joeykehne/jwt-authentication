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
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { SetPermissions } from 'src/auth/permission/permissions.decorator';
import { Public } from 'src/auth/public.decorator';
import { UserService } from './user.service';

@SetPermissions('iam')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Public()
  @Get('me')
  async me(@Req() req: any) {
    const token = req.headers['authorization'];

    if (!token) throw new UnauthorizedException('No token provided');

    const [, tokenValue] = token.split(' ');

    if (!tokenValue) throw new UnauthorizedException('No token provided');

    const payload = await this.authService.validateToken(tokenValue, 'access');

    const user = await this.userService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  @SetPermissions('iam')
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @SetPermissions('iam')
  @UseGuards(AuthGuard)
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
