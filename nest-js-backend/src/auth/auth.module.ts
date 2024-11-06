import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Permission } from './permission/permission.entity';
import { PermissionModule } from './permission/permission.module';
import { RefreshToken } from './refreshToken.entity';
import { Role } from './role/role.entity';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forFeature([User, Role, Permission, RefreshToken]),
    UserModule,
    RoleModule,
    PermissionModule,
    ScheduleModule.forRoot(),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
