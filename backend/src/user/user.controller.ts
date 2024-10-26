import { Get, Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getUsers() {
    return this.userService.findAllUsers();
  }

  @Get('create')
  async createUser() {
    return this.userService.createUser('John Doe', '1', 'password');
  }
}
