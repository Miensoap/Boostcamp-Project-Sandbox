import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
