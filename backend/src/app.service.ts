import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    console.log(this.userRepository.id);
  }

  async getHello() {
    return (
      'Hello World!' +
      (await this.userRepository.find()).map((user) => user.name).join(', ')
    );
  }
}
