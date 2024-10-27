import { Repository, DataSource } from 'typeorm';
import { User } from './entity/User';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  id: number;

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
    this.id = Math.random();
  }
}
