import { Injectable } from '@nestjs/common';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';

@Injectable()
export class <%= classify(name) %>Service {
  create(req: any, <%= camelize(name) %>: Partial<<%= classify(name) %>>) {
    return 'This action adds a new <%= dasherize(name) %>';
  }

  findAll(req: any) {
    return `This action returns all <%= dasherize(name) %>s`;
  }

  findOne(req: any, id: string) {
    return `This action returns a #${id} <%= dasherize(name) %>`;
  }

  update(req: any, id: string, updated<%= classify(name) %>: Partial<<%= classify(name) %>>) {
    return `This action updates a #${id} <%= dasherize(name) %>`;
  }

  remove(req: any, id: string) {
    return `This action removes a #${id} <%= dasherize(name) %>`;
  }
}
