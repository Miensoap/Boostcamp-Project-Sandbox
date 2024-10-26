import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getHello() {
    return (
      'Hello World!' +
      (await this.userRepository.find()).map((user) => user.name).join(', ')
    );
  }
}
