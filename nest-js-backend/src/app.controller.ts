import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

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

  @Get('admin')
  admin() {
    return { message: 'admin' };
  }
}
