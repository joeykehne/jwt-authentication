import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth.module';
import { PermissionController } from './permission.controller';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    forwardRef(() => AuthModule),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
