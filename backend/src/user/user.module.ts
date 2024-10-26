import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const userRepository = TypeOrmModule.forFeature([User]);

@Module({
  imports: [userRepository],
  controllers: [UserController],
  providers: [UserService],
  exports: [userRepository],
})
export class UserModule {}
