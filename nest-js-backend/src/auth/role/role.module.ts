import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth.module';
import { Permission } from '../permission/permission.entity';
import { PermissionModule } from '../permission/permission.module';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
    PermissionModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
