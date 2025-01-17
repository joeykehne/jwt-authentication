import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';

@UseGuards(AuthGuard)
@Controller('<%= dasherize(name) %>')
export class <%= classify(name) %>Controller {
  constructor(private readonly <%= camelize(name) %>Service: <%= classify(name) %>Service) {}

  @Post()
  create(@Req() req: any, @Body() <%= camelize(name) %>: Partial<<%= classify(name) %>>) {
    return this.<%= camelize(name) %>Service.create(req, <%= camelize(name) %>);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.<%= camelize(name) %>Service.findAll(req);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.<%= camelize(name) %>Service.findOne(req, id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updated<%= classify(name) %>: Partial<<%= classify(name) %>>,
  ) {
    return this.<%= camelize(name) %>Service.update(req, id, updated<%= classify(name) %>);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.<%= camelize(name) %>Service.remove(req, id);
  }
}
