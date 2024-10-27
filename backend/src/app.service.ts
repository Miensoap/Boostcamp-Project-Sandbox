import { Injectable } from '@nestjs/common';
import { UserRepository } from './user/user.repository';

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UserRepository) {}

  async getHello() {
    return (
      'Hello World!' +
      (await this.userRepository.find()).map((user) => user.name).join(', ')
    );
  }
}
