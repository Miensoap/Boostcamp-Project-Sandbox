import { Injectable } from '@nestjs/common';
import { User } from './entity/User';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {
    console.log(this.userRepository.id);
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.userRepository.create({ name, email, password });
    return await this.userRepository.save(user);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserByName(name: string): Promise<User> {
    return await this.userRepository.findOne({
      select: ['name'],
      where: { name },
    });
  }
}
