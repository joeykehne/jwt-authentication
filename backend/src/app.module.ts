import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamingStrategyInterface } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { UserModule } from './user/user.module';

class CustomNamingStrategy
  extends SnakeNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName: string | undefined): string {
    const prefix = process.env.NODE_ENV !== 'production' ? '_DEV_' : '';
    return `${prefix}${customName || className}`;
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV !== 'production' ? '.env' : undefined,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        synchronize: process.env.NODE_ENV !== 'production',
        autoLoadEntities: true,
        namingStrategy: new CustomNamingStrategy(),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: 465,
          secure: true,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"Nodemailer" <nodemailer@kehne-it.de>',
        },
      }),
    }),
    AuthModule,
    UserModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService, Reflector],
})
export class AppModule {}
