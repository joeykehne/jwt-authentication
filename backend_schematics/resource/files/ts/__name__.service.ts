import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { <%= classify(name) %> } from './entities/<%= dasherize(name) %>.entity';

@Injectable()
export class <%= classify(name) %>Service {
  constructor(
    @InjectRepository(<%= classify(name) %>)
    private readonly <%= camelize(name) %>Repository: Repository<<%= classify(name) %>>,
  ) {}

  create(req: any, <%= camelize(name) %>: Partial<<%= classify(name) %>>) {
    <%= camelize(name) %>.user = req.user;

    return this.<%= camelize(name) %>Repository.save(<%= camelize(name) %>);
  }

  findAll(req: any) {
    return this.<%= camelize(name) %>Repository.find({
      where: { user: req.user },
    });
  }

  findOne(req: any, id: string) {
    return this.<%= camelize(name) %>Repository.findOne({
      where: { user: req.user.user, id },
    });
  }

  update(req: any, id: string, updated<%= classify(name) %>: Partial<<%= classify(name) %>>) {
    return this.<%= camelize(name) %>Repository.update(
      { user: req.user, id },
      updated<%= classify(name) %>,
    );
  }

  remove(req: any, id: string) {
    return this.<%= camelize(name) %>Repository.delete({
      user: req.user,
      id,
    });
  }
}
