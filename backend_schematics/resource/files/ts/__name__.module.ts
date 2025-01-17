import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { <%= classify(name) %>Controller } from './<%= dasherize(name) %>.controller';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([<%= classify(name) %>]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [<%= classify(name) %>Controller],
  providers: [<%= classify(name) %>Service],
})
export class <%= classify(name) %>Module {}
