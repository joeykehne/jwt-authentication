import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionModule } from 'src/auth/permission/permission.module';
import { Role } from 'src/auth/role/role.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PermissionModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  exports: [],
  controllers: [UserController],
})
export class UserModule {}
