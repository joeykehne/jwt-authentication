import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  @Get()
  sayHello() {
    return { message: 'hello' };
  }

  @UseGuards(AuthGuard)
  @Get('protected')
  protected() {
    return { message: 'protected' };
  }

  @UseGuards(AdminGuard)
  @Get('admin')
  admin() {
    return { message: 'admin' };
  }
}
