import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { SetPermissions } from './auth/permission/permissions.decorator';

@Controller()
export class AppController {
  @Get()
  sayHello() {
    return { message: 'hello' };
  }

  @UseGuards(AuthGuard)
  protected() {
    return { message: 'protected' };
  }

  @SetPermissions('admin')
  @UseGuards(AuthGuard)
  @Get('admin')
  admin() {
    return { message: 'admin' };
  }
}
