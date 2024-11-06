import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { Permissions } from './auth/permission/permissions.decorator';

@Controller()
export class AppController {
  @Get()
  sayHello() {
    return { message: 'hello' };
  }

  @UseGuards(AuthGuard)
  @Permissions('test-permission')
  @Get('protected')
  protected() {
    return { message: 'protected' };
  }

  @Get('admin')
  admin() {
    return { message: 'admin' };
  }
}
